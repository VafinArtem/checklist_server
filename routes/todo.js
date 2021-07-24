const {Router} = require("express");
const Cryptr = require('cryptr');
const Todo = require("../models/todo");
const User = require("../models/user");
// const Project = require("../models/project");
// eslint-disable-next-line node/no-unpublished-require
const security = require("../utils/security");

const cryptr = new Cryptr(security.crypt.PASSWORD);

const router = new Router();

router.get(`/`, async (req, res) => {
  try {
    if (req.session.isAuth) {
      const user = await User.findByPk(req.session.user.id);
      const todos = await user.getTodos();
      todos.forEach((todo) => {
        todo.text = cryptr.decrypt(todo.text);
      });
      res.status(200).json(todos);
    } else {
      const todos = await Todo.findAll({
        where: {
          projectId: 3
        }
      });
      res.status(200).json(todos);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post(`/complite/:id/:status`, async (req, res) => {
  try {
    const todo = await Todo.findByPk(+req.params.id);
    todo.isComplite = req.params.status;
    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    console.log(error);
  }
});

router.post(`/add`, async (req, res) => {
  try {
    const todo = await Todo.create({
      text: cryptr.encrypt(req.body.text),
      isComplite: false,
      project: "default",
      cathegory: "default",
    });
    todo.text = cryptr.decrypt(todo.text);
    res.status(201).json({todo});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `Server error`
    });
  }
});

router.post(`/edit/:id/`, async (req, res) => {
  try {
    const todo = await Todo.findByPk(+req.params.id);
    todo.text = req.body.text;
    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    console.log(error);
  }
});

// router.put(`/:id`, (req, res) => {});

router.delete(`/delete/:id`, async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: {
        id: req.params.id
      }
    });
    const todo = todos[0];
    await todo.destroy();
    res.status(200).json();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
