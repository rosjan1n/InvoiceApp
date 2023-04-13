const Client = require('../../database/models/Client');

class ClientController {
  async saveClient(req, res) {
    const data = req.body;

    let client;
    try {
      client = new Client({
        name: data?.name,
        project_id: data?.project_id,
        address: data?.address,
        private: data?.private
      });
      await client.save();
    } catch (error) {
      return res.status(422).json({ message: error.message });
    }
    res.status(201).json(client);
  }

  async getAllClients(req, res) {
    let data;
    try {
      data = await Client.find({});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(200).json(data);
  }

  async getClient(req, res) {
    let data;
    try {
      const id = req.params.id;
      data = await Client.findOne({ _id: id });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(200).json(data);
  }
}

module.exports = new ClientController();