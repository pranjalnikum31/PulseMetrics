const {
    createApiKeyService,
    getAllApiKeysService,
    updateApiKeyService
}=require("../services/apiKey.service");

const createApiKey=async(req,res)=>{
    const result=await createApiKeyService(req.body,req.user);
    res.status(result.success ? 201 : 400).json(result);
}
const getAllApiKeys=async(req,res)=>{
    const result=await getAllApiKeysService(req.user);
    res.status(result.success ? 201 : 400).json(result);
}
const updateApiKey=async(req,res)=>{
    const result=await updateApiKeyService(req.params.id,req.body,req.user);
    res.status(result.success ? 200 : 400).json(result);
}
module.exports={
    createApiKey,
    getAllApiKeys,
    updateApiKey
}