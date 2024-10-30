import mongoose from "mongoose"; 

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_URI);

    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to database: ${error.message}`);

    process.exit(1);
  }
};

export default connection;
