const http = require("http");

/// crear el servidor

const server = http.createServer((req, res) => {
  // configuramos la respuesta del server
  res.statusCode = 200; // respuesta OK
  res.setHeader("Content-Type", "text/plain"); // headers
  res.end("Que tarde se nos hace");
});

/// Escuchamos el servidor para mantenerlo levantado
/// 8080 es el numero que va recibir el localhost que va ser el puerto
//
server.listen(8080, () => {
  console.log("server listening on porrt http://localhost:8080");
});
