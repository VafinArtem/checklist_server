const {Router} = require("express");
const Card = require("../models/card");

const router = Router();

router.get(`/`, async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.status(200).json(cards);
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

router.put(`/:id`, (req, res) => {});

router.delete(`/:id`, (req, res) => {});

module.exports = router;
