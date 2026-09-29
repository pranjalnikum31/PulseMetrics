const { createEventService,createServerEventService } = require("../services/event.service");

const createEvent = async (req, res, next) => {
  try {
    const result = await createEventService(req.body, req.headers["x-api-key"]);

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    next(error);
  }
};

const createServerEvent = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];

    const result = await createServerEventService(req.body, apiKey);

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  createServerEvent
};
