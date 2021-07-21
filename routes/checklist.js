const {Router} = require("express");
const Cryptr = require('cryptr');
const Card = require("../models/card");
const User = require("../models/user");
// eslint-disable-next-line node/no-unpublished-require
const security = require("../utils/security");

const cryptr = new Cryptr(security.crypt.password);

const router = new Router();

router.get(`/`, async (req, res) => {
  try {
    if (req.session.isAuth) {
      const user = await User.findByPk(req.session.user.id);
      const cards = await user.getCards();
      cards.forEach((card) => {
        card.text = cryptr.decrypt(card.text);
      });
      res.status(200).json(cards);
    } else {
      const cards = await Card.findAll({
        where: {
          userId: null
        }
      });
      res.status(200).json(cards);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post(`/complite/:id/:status`, async (req, res) => {
  try {
    const card = await Card.findByPk(+req.params.id);
    card.isComplite = req.params.status;
    await card.save();
    res.status(200).json(card);
  } catch (error) {
    console.log(error);
  }
});

router.post(`/add`, async (req, res) => {
  try {
    const card = await Card.create({
      text: cryptr.encrypt(req.body.text),
      isComplite: false,
      project: "default",
      cathegory: "default",
      userId: req.session.user.id
    });
    card.text = cryptr.decrypt(card.text)
    res.status(201).json({card});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `Server error`
    });
  }
});

router.post(`/edit/:id/`, async (req, res) => {
  try {
    const card = await Card.findByPk(+req.params.id);
    card.text = req.body.text;
    await card.save();
    res.status(200).json(card);
  } catch (error) {
    console.log(error);
  }
});

// router.put(`/:id`, (req, res) => {});

router.delete(`/delete/:id`, async (req, res) => {
  try {
    const cards = await Card.findAll({
      where: {
        id: req.params.id
      }
    });
    const card = cards[0];
    await card.destroy();
    res.status(200).json();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
