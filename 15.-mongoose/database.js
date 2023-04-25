/// Vamos a utilizar dotenv para que las variables se encuentre ocultas en nuestro repositorio
const dotenv = require("dotenv");

// configurar el dotenv
dotenv.config();

/// importanos mongoose

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

/// VAMOS A CONECTAR LA BASE DE DATOS CON MONGODB

const connect = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI, {
      /// es para hacer que la URL de MONGO se parsee
      useNewUrlParser: true,
      // convertir los caracteres especiales
      useUnifiedTopology: true,
    });

    const { name, host } = db.connection;
    console.log(`Conectada la DB ${name} en el host ${host}`);
  } catch (error) {
    console.log("ERROR EN LA CONEXION ❌", error);
  }
};

module.exports = { connect };
