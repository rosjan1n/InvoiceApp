const asyncHandler = require('express-async-handler');

const Project = require('../../database/models/Project');
const User = require('../../database/models/User');

const getProjects = asyncHandler(async (req, res) => {
  const project = await Project.find({ user: req.user.id });

  res.status(200).json(project);
})

const createProject = asyncHandler(async (req, res) => {
  console.log(req);

  const project = await Project.create({
    name: req.body.name,
    client_id: req.body.client_id,
    category: req.body.category,
    status: req.body.status,
    user: req.user.id
  })

  res.status(200).json(project);
})

module.exports = {
  getProjects,
  createProject
}