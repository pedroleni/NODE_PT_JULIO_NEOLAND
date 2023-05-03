// CREAMOS LA CONEXION CON LA BASE DE DATOS

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

/// NOS TRAEMOS LA MONGO_URI para saber la url donde conectar la db

const MONGO_URI = process.env.MONGO_URI;
/// CREAMOS UNA FUNCION QUE VAMOS A UTILIZAR EN EL ARCHIVO INDEX
const connect = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { name, host } = db.connection;
    console.log(`Conneted to db: ${name} in host: ${host}`);
  } catch (error) {
    console.log("Error in connecting to DB", error);
  }
};

module.exports = connect;
