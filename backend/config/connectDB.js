import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("ENV VALUE:", process.env.MONGO_URL); // debug

    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Atlas Connected Successfully 🚀");
  } catch (error) {
    console.log("error to connect DB", error);
    process.exit(1);
  }
};
