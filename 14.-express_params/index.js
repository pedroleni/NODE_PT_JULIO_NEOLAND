const express = require("express");

const app = express();
const router = express.Router();
const PORT = 8080;

///// ----------- ROUTING --------------

/// QUERY --->  Parametros opcionales

router.get("/name", (req, res) => {
  const id = req.query.id;
  ///  es un parametro que es opcional y que no rompe la ejecucion del controlador
  // para acceder a el valor se introduce en el path completo de la siguiente forma:
  // http://localhost:8080/name?id=125234646242567
  /// primero ?
  /// segundo el nombre del query
  /// tercero el = con el valor
  res.send(`La query es ${id}`);
});

// PARAMS ----> son obligatorios sino rompe la ejecucion o no hace match con la routa

//// ------> EJERCICIO PARA CORREGIR EL SIGUIENTE DIA------------

router.get("/person/:name", (req, res) => {
  const { name } = req.params;
  ///const name = req.params.name  ----> ESTO ES LO MISMO QUE LO DE ARRIBA
  const people = ["Luis", "Lorena", "Felipe", "Joaquin", "Luis"];

  /// quiero encontrar a la persona que estoy mamndando por los params
  const indexWord = [];
  people.map((element, index) => {
    element.toLowerCase() === name.toLowerCase() && indexWord.push(index);
  });

  /// ----> SOLO NOS VALE CUANDO TENEMOS UN ELEMENTO: const index = peopleToLowerCase.indexOf(name.toLowerCase());
  indexWord.length === 0
    ? res.send("No lo he encontrado")
    : res.send(`Se encuentra en la posicion ${indexWord.toString()}`);
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server listening on port 🐱‍🚀 http://localhost:${PORT}`);
});
