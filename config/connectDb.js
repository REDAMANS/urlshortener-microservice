const mongoose = require('mongoose');

const DATABASE_URI = "mongodb+srv://redamans357:golglo123@cluster0.vlgsnqy.mongodb.net/?retryWrites=true&w=majority";

const connectDb = async () => {
  try {
    await mongoose.connect(DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = connectDb