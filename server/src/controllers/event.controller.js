const { createEventService } = require("../services/event.service");

const createEvent = async (req, res, next) => {
    try {
        const result = await createEventService(
            req.body,
            req.headers["x-api-key"]
        );

        res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEvent,
};