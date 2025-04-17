import mongoose from "mongoose";

const connectWithDb = (URI) => {
  try {
    mongoose.connect(URI).then(() => {
      console.log("Connected with DB!");
    });
  } catch (error) {
    console.log("Error connecting with DB ", error.message);
  }
};

export default connectWithDb;
