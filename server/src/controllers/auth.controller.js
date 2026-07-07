
const {register:registerService }=require('../services/auth.service');


const register=async(req,res)=>{
    const result=await registerService(req.body);
    res.send(result);
}
module.exports={register};