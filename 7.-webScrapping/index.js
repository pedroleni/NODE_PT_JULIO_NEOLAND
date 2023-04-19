const puppeteer = require("puppeteer");
const fs = require("fs");

const srapping = async () => {
  const BASE_URL = "https://www.game.es/buscar/brv/o=7&cf=000a_aa0211:5:GIDS";

  /// crear el navegador para inicie maximizado

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  /// abrir navegador

  const page = await browser.newPage();

  /// enviarle la url base para que la cargue utilizamos goto()

  await page.goto(BASE_URL);
  await page.waitForTimeout(4000); // 4 segundos

  // tenemos que hacer varias veces scroll para coger el mayor numero de elementos

  await page.evaluate(() => {
    const element = document.getElementById("l-footer");
    const y = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: y });
  });

  await page.evaluate(() => {
    const element = document.getElementById("l-footer");
    const y = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: y });
  });

  await page.evaluate(() => {
    const element = document.getElementById("l-footer");
    const y = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: y });
  });
  // esperamos a los elementos de la busqueda para poder estar disponibles y guardarlos en un objeto
  await page.waitForSelector(".search-item");

  /// Hacemos un pantallazo para que la imagen salga
  await page.screenshot({
    path: "example.png",
    fullPage: true,
  });

  // vamos a ver como recuperar los diferentes nodos
  /// -------TITLE -----------------

  const title = await page.$$eval("a.cm-txt", (nodes) =>
    nodes.map((n) => n.innerText)
  );

  /// -------PRICES -----------------
  const prices = await page.$$eval("div.buy--price", (nodes) =>
    nodes.map((n) => n.innerText)
  );

  /// ------ IMAGES -----------------

  const images = await page.$$eval(".img-responsive", (nodes) =>
    nodes.map((n) => n.src)
  );

  console.log(prices);

  // construimos el objeto que luego escribiremos en un JSON
  const GAMESPRODUCTS = title.map((item, index) => ({
    titles: title[index],
    price: prices[index],
    image: images[index],
  }));

  // borrar el ultimo elemento porque sale vacio
  GAMESPRODUCTS.pop();

  /// DEBEMOS CONVERTIR EL OBJETO EN UN STRING
  const gameData = JSON.stringify(GAMESPRODUCTS);

  fs.writeFile("data.json", gameData, () => {
    console.log("archivo escrito 👌");
  });

  await browser.close();
};

srapping();
