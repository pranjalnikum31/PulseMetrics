const {
    createApiKeyService
}=require("../services/apiKey.service");

const createApiKey=async(req,res)=>{
    const result=await createApiKeyService(req.body,req.user);
    res.status(result.success ? 201 : 400).json(result);
}
module.exports={
    createApiKey
}