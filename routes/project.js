const {Router} = require("express");
const Project = require("../models/project");
const User = require("../models/user");
const router = new Router();

router.get(`/`, async (req, res) => {
  try {
    if (req.session.isAuth) {
      const user = await User.findByPk(req.session.user.id);
      const projects = await user.getProjects();
      res.status(200).json({projects, projectId: req.session.projectId});
    } else {
      const projects = await Project.findAll({
        where: {
          name: `UnregisteredProject`
        }
      });
      res.status(200).json({projects});
    }
  } catch (error) {
    console.log(error);
  }
});

router.post(`/add`, async (req, res) => {
  try {
    if (req.session.isAuth) {
      const project = await Project.create({
        name: req.body.name,
        userId: req.session.user.id
      });
      res.status(201).json({project});
    } else {
      res.status(401).json({error: `Вы не авторизованы`});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `Server error`
    });
  }
});

module.exports = router;
