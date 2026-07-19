const jwt=require('jsonwebtoken');
const prisma=require('../config/prisma');

const verifyUser = async (req, res, next) => {
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:'Authorization header missing or invalid'});
    }
    const token=authHeader.split(" ")[1]; 

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await prisma.user.findUnique({
            where:{
                id:decoded.id
            }
        });
        if(!user){
            return res.status(401).json({message:'Invalid token'});
        }
        const{password,...userWithoutPassword}=user;
        req.user=userWithoutPassword;
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Invalid token'
        });
    }
};

module.exports={verifyUser};