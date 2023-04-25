const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
/// CONECTAMOS CON LA DB ----> MONGODB
const { connect } = require("./database");
connect();

/// EMPREZAMOS EL CREAR EL SERVIDOR WEB QUE GESTIONA LA DB

const PORT = process.env.PORT;

const app = express();
app.listen(PORT, () => {
  console.log(`Server running on 🎉 http://localhost:${PORT}`);
});
