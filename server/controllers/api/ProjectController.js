const asyncHandler = require("express-async-handler");

const Project = require("../../database/models/Project");
const Activity = require("../../database/models/Activity");

const getProjects = asyncHandler(async (req, res) => {
  const project = await Project.find({ user: req.user.id });

  res.status(200).json(project);
});

const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    client_id: req.body.client_id,
    category: req.body.category,
    status: req.body.status,
    user: req.user.id,
  });

  project.save();

  const activity = await Activity.create({
    user: req.user.id,
    activity_name: "CREATE_PROJECT",
    project_id: project._id,
    toClient: project?.client_id,
    timestamp: new Date(),
  });

  await activity.save();

  res.status(200).json(project);
});

module.exports = {
  getProjects,
  createProject,
};
