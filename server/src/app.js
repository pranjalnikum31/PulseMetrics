const express=require('express');
const app=express();
const authRoutes=require('./routes/auth.routes');
const projectRoutes=require('./routes/project.routes')
const apiKeyRoutes = require("./routes/apiKey.routes");
const eventRoutes = require("./routes/event.routes");

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to PulseMetrics API 🚀");
})

app.use('/api/auth',authRoutes);
app.use('/api/projects',projectRoutes);
app.use("/api/api-keys", apiKeyRoutes);
app.use("/api/events", eventRoutes);
module.exports = app;