const {Router} = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = new Router();



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
          res.status(200).json({succes: `Вход успешно выполнен`})
        })
      } else {
        res.status(200).json({error: `Введен не верный пароль`})
      }
    } else {
      res.status(200).json({error: `Такого пользователя не существует`})
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
    res.status(401).json({error: `Вы не авторизованы`})
  }
});

router.post(`/signin`, async (req, res) => {
  try {
    const {email, password} = req.body;
    const candidate = await User.findOne({where: {email}});

    if (candidate) {
      res.status(200).json({error: `Пользователь с таким именем уже существует`})
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashPassword,
      });
      res.status(200).json({succes: `Пользователь создан`})
    }
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
