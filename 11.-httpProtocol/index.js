/// nos traemos el protocolo
const http = require("http");

// Definimos el puerto del servidor
const PORT = 8080;

//// Manejador de las peticiones

const requestHandle = (req, res) => {
  ///
  console.log(req.url);

  if (req.url === "/") {
    // como enviar un html por la respuesta
    res.setHeader("Content-Type", "text/html");

    //le damos el status code de la
    res.writeHead(200);

    res.end(`<h1>Esto es mi primera routa con NODE JS</h1>`);
  } else if (req.url === "/users" && req.method === "GET") {
    /// vamos a decir las cabezas con el tipo de elemento que vamos a enviar
    res.setHeader("Content-Type", "application/json");
    // codigo status de la respuesta
    res.writeHead(200);

    //Enviamos la informacion al cliente
    res.end(JSON.stringify({ name: "Peter", surname: "Parker", age: 23 }));
  }
};

// Creamos el servidor que contiene el manejador del servidor
const server = http.createServer(requestHandle);

// Escuchamos el servidor para empezar a ejecutarlo
server.listen(PORT, () => {
  console.log(`Server listening on port 🐱‍🚀 http://localhost:${PORT}`);
});
