const {
  getOverviewService,
  getTopEventsService,
  getRecentEventsService,
  getEventsByDayService
  
} = require("../services/analytics.service");

const getOverview = async (req, res) => {
  try {
    const result = await getOverviewService(req.user,req.query.days);
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
const getRecentEvents=async(req,res)=>{
  try{
    const result=await getRecentEventsService(req.user);
    res.status(result.success ? 200 : 400).json(result);
  }catch(error){
    res.status(500).json({ success: false, message: error.message });
  }
}

const getEventsByDay=async(req,res)=>{
  try{
    const result=await getEventsByDayService(req.user);
    res.status(result.success ? 200 : 400).json(result);
  }catch(error){
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getOverview,
  getTopEvents,
  getRecentEvents,
  getEventsByDay
};
