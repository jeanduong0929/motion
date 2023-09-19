import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connecting to MongoDB...");
  } catch (error: any) {
    console.log("Error: ", error.message);
  }
};

export default connectDB;
