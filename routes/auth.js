const {Router} = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const Project = require("../models/project");
const Todo = require("../models/todo");
const regEmail = require("../emails/registration");
// eslint-disable-next-line node/no-unpublished-require
const security = require("../utils/security");

const router = new Router();

const transporter = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: security.sendgrid.KEY,
  }
}));

router.post(`/login`, async (req, res) => {
  try {
    const {email, password} = req.body;
    const candidate = await User.findOne({where: {email}});

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuth = true;
        req.session.save((error) => {
          if (error) {
            throw error;
          }
          res.status(200).json({succes: `Вход успешно выполнен`});
        });
      } else {
        res.status(200).json({error: `Введен не верный пароль`});
      }
    } else {
      res.status(200).json({error: `Такого пользователя не существует`});
    }
  } catch (error) {
    console.log(error);
  }
});

router.get(`/logout`, async (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({succes: `Выход успешно выполнен`});
  });
});

router.get(`/login`, async (req, res) => {
  if (req.session.isAuth) {
    res.status(200).json({succes: `Вы авторизованы`, email: req.session.user.email});
  } else {
    res.status(401).json({error: `Вы не авторизованы`});
  }
});

const DeafaultTodos = [
  {
    text: `Тестовая карточка 1`,
    isComplite: false,
    cathegory: "default",
    project: "default",
  },
  {
    text: `Тестовая карточка 2`,
    isComplite: false,
    project: "default",
    cathegory: "default",
  }
];

router.post(`/signin`, async (req, res) => {
  try {
    const {email, password} = req.body;
    const candidate = await User.findOne({where: {email}});

    // const todo = await Todo.create({
      // text: cryptr.encrypt(req.body.text),
      // isComplite: false,
      // project: "default",
      // cathegory: "default",
    // });

    if (candidate) {
      res.status(200).json({error: `Пользователь с таким именем уже существует`});
    } else {
      let userId;
      let projectId;
      const hashPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashPassword,
      }).then((res) => {
        userId = res.dataValues.id;
      });
      await Project.create({
        name: `По умолчанию`,
        userId
      }).then((res) => {
        projectId = res.dataValues.id;
      });
      DeafaultTodos.forEach(async (todo) => {
        await Todo.create({
          text: todo.text,
          isComplite: todo.isComplite,
          cathegory: todo.cathegory,
          project: todo.project,
          projectId
        });
      });
      // await Project.create({
      //   name: "По умолчанию",
      //   userId: req.session.user.id
      // })
      res.status(200).json({succes: `Пользователь создан`});
      await transporter.sendMail(regEmail(email));
    }
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
