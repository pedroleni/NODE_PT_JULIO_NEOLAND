import fs from "fs";
import inquirer from "inquirer";
import puppeteer from "puppeteer";
let keyWord = "";
const scrapping = async () => {
  const URL_BASE = "https://www.game.es/";

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  await page.goto(URL_BASE);
  await page.click("#searchinput");

  await page.type("#searchinput", keyWord);
  await page.keyboard.press("Enter");

  await page.waitForTimeout(6000);

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

  await page.evaluate(() => {
    const element = document.getElementById("l-footer");
    const y = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: y });
  });

  /// $$eval ------- evaluar los nodos de la pagina que queremos guardar en local

  const items = await page.$$eval("div.search-item", (nodes) => {
    return nodes.map((n) => ({
      title: n.querySelector("a.cm-txt").innerText,
      price: n.querySelector("div.buy--price")?.innerText,
      image: n.querySelector(".img-responsive")?.src,
      type: n.querySelector("span.cm-txt")?.innerText,
    }));
  });
  items.pop();
  console.log(items);

  await browser.close();

  const dataString = JSON.stringify(items);

  fs.writeFile(
    `${keyWord.replace(" ", "").toLowerCase()}.json`,
    dataString,
    () => {
      console.log("Hemos creado el archivo 👌");
    }
  );
};

inquirer
  .prompt([
    {
      name: "busqueda",
      message: "Que es lo quiere buscar? 🔍",
    },
  ])
  .then((answers) => {
    keyWord = answers.busqueda;
    scrapping();
  });
