const {Router} = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const Project = require("../models/project");
const Todo = require("../models/todo");
const regEmail = require("../emails/registration");
// eslint-disable-next-line node/no-unpublished-require
const security = require("../utils/security");
const restore = require("../emails/restore");
const newPassword = require("../emails/new-password");

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

router.post('/restore', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        res.status(200).json({error: `Произошла ошибка. Повторите позже.`});
        return;
      }
      const token = buffer.toString('hex');
      const candidate = await User.findOne({where: {email: req.body.email}});

      if (candidate) {
        candidate.restoreToken = token;
        candidate.restoreTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transporter.sendMail(restore(candidate.email, token));
        res.status(200).json({succes: `Ссылка для востановления пароля отправлена вам на email`});
      } else {
        res.status(200).json({error: `Такого email не существует`});
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/new-password', async (req, res) => {
  try {
    const {token, password} = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const candidate = await User.findOne({where: {restoreToken: token, restoreTokenExp: {[Op.gt]: Date.now()}}});

    if (candidate) {
      candidate.password = hashPassword;
      candidate.restoreToken = ``;
      candidate.restoreTokenExp = Date.now();
      await candidate.save();
      await transporter.sendMail(newPassword(candidate.email));
      res.status(200).json({succes: `Вы успешно изменили пароль`});
    } else {
      res.status(200).json({error: `Такого токена не существует, или он уже истек`});
    }
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
