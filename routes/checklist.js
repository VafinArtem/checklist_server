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

router.post(`/`, (req, res) => {});

router.put(`/:id`, (req, res) => {});

router.delete(`/:id`, (req, res) => {});

module.exports = router;
