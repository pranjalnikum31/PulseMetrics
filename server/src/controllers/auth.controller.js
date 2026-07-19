
const {register:registerService,login:loginService }=require('../services/auth.service');


const register=async(req,res)=>{
    const result=await registerService(req.body);
    res.send(result);
}

const login=async(req,res)=>{
    const result=await loginService(req.body);

    res.status(result.success ? 200 : 400).send(result);
}
module.exports={register,login};