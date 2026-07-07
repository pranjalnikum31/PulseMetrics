const prisma = require("../config/prisma");

const register = async (data) => {
    const{companyName,companyEmail,ownerName,ownerEmail,password}=data;
    if(!companyName || !companyEmail || !ownerName || !ownerEmail || !password) {
        return {
            success:false,
            message:"All fields are required"
        }
    }
    const existingCompany = await prisma.company.findUnique({
        where: {
            email: companyEmail,
        },
    });
    if (existingCompany) {
        return {
            success: false,
            message: "Company already exists",
        };
    }
    return{
        success:true,
        message:"User registered successfully",
    }
};

module.exports = {
    register,
};