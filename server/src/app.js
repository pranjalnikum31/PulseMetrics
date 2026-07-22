const express=require('express');
const app=express();
const authRoutes=require('./routes/auth.routes');
const projectRoutes=require('./routes/project.routes')

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to PulseMetrics API 🚀");
})

app.use('/api/auth',authRoutes);
app.use('/api/projects',projectRoutes);
module.exports = app;