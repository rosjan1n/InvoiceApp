const Project = require('../../database/models/Project');

class ProjectController {
  async saveProject(req, res) {
    const data = req.body;

    let project;

    try {
      project = new Project({
        name: data.name,
        client_id: data.client_id,
        category: data.category,
        status: data.status
      });
      await project.save();
    } catch (error) {
      return res.status(422).json({ message: error.message });
    }
    res.status(201).json(project);
  }

  async getAllProjects(req, res) {
    let data;
    try {
      data = await Project.find({});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(200).json(data);
  }

  async getProject(req, res) {
    let data;
    try {
      const id = req.params.id;
      data = await Project.findOne({ _id: id });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(200).json(data);
  }
}

module.exports = new ProjectController();