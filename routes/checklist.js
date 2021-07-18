const {Router} = require("express");
const Card = require("../models/card");

const router = new Router();

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

router.post(`/add`, async (req, res) => {
  try {
    const card = await Card.create({
      text: req.body.text,
      isComplite: false,
      project: "default",
      cathegory: "default",
    });
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
