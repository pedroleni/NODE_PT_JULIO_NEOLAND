/// nos traemos express para utilizarlo
const express = require("express");

// creamos el puerto

const PORT = 8080;

// crear servidor
const app = express();

// escuchamos el servidor y le asociamos el puerto
app.listen(PORT, () => {
  console.log(`Server listening on port 🐱‍🚀 http://localhost:${PORT}`);
});
