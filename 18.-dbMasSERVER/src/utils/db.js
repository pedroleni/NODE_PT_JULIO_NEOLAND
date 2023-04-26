const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connect = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const { name, host } = db.connection;
    console.log(
      `Tenemos la DB CONECTADA con el name ${name} y el host ${host}`
    );
  } catch (error) {
    console.log("Error con la conexion a la DB", error);
  }
};

module.exports = connect;
