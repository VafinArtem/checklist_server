const {Router} = require("express");
const User = require("../models/user");

const router = new Router();

router.post(`/login`, async (req, res) => {
  try {
    const {email, password} = req.body;
    const candidate = await User.findOne({where: {email}});

    if (candidate) {
      const areSame = password === candidate.password;

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuth = true;
        req.session.save((error) => {
          if (error) {
            throw error;
          }
          res.status(200).json({answer: `Вход успешно выполнен`})
        })
      }
    } else {
      res.status(200).json({answer: `Пользователя не существует`})
    }
  } catch (error) {
    console.log(error);
  }
});

router.get(`/logout`, async (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({answer: `Выход успешно выполнен`});
  });
});

router.post(`/signin`, async (req, res) => {
  try {
    const {email, password} = req.body;
    const candidate = await User.findOne({where: {email}});
    if (candidate) {
      res.status(200).json({answer: `Пользователя с таким именем существует`})
    } else {
      await User.create({
        email,
        password,
      });
      res.status(200).json({answer: `Пользователь создан`})
    }
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
