const dotenv=require('dotenv');

dotenv.config();

const app=require('./app');
const redis = require("./config/redis");
const { connectKafka } = require("./config/kafka");

const PORT=process.env.PORT || 3000;


const startServer = async () => {
  try {
    await redis.connect();
    console.log("Redis connected");
    await connectKafka();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();