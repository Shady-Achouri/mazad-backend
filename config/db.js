const mongoose = require("mongoose");
const { mongoURI } = require("./general");

const connectDatabase = async () => {
  if (!mongoURI) {
    throw new Error("auth DB_URI must be defined");
  }
  try {
    //Connection to Mongo
    await mongoose.connect(
      mongoURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (error) => error && console.log(error)
    );
    console.log("Server connected to MongoDb!");
  } catch (err) {
    console.error(err);
  }
};

module.exports = { connectDatabase };
