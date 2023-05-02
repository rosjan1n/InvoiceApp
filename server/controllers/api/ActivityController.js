const asyncHandler = require("express-async-handler");

const Activity = require("../../database/models/Activity");

const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ user: req.user.id });

  res.status(200).json(activities);
});

module.exports = {
  getActivities,
};
