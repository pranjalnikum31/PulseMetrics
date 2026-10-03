const {
  getOverviewService,
  getTopEventsService,
  getRecentEventsService,
  getEventsByDayService,
  getProjectAnalyticsService,
} = require("../services/analytics.service");

const getOverview = async (req, res) => {
  try {
    const result = await getOverviewService(req.user, req.query.days);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getTopEvents = async (req, res) => {
  try {
    const result = await getTopEventsService(req.user);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getRecentEvents = async (req, res) => {
  try {
    const result = await getRecentEventsService(req.user);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEventsByDay = async (req, res) => {
  try {
    const result = await getEventsByDayService(req.user);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectAnalytics = async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;
    if (![7, 30, 90].includes(days)) {
      return res.status(400).json({
        success: false,
        message: "Days must be 7, 30, or 90",
      });
    }
    const result = await getProjectAnalyticsService(
      req.params.id,
      req.user,
      days,
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOverview,
  getTopEvents,
  getRecentEvents,
  getEventsByDay,
  getProjectAnalytics,
};
