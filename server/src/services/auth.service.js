const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const register = async (data) => {
  const { companyName, companyEmail, ownerName, ownerEmail, password } = data;
  if (!companyName || !companyEmail || !ownerName || !ownerEmail || !password) {
    return {
      success: false,
      message: "All fields are required",
    };
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
  const existingUser = await prisma.user.findUnique({
    where: {
      email: ownerEmail,
    },
  });
console.log("Existing User:", existingUser);
  if (existingUser) {
    return {
      success: false,
      message: "user already exists",
    };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: companyName,
        email: companyEmail,
      },
    });
    const user = await tx.user.create({
      data: {
        name: ownerName,
        email: ownerEmail,
        password: hashedPassword,
        role: "OWNER",
        companyId: company.id,
      },
    });
    const token = generateToken(user);
    return { company, user, token };
  });
  return {
    success: true,
    message: "Registration successful",
    token: result.token,
    company: result.company,
    user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
    },
  };
};

module.exports = {
  register,
};
