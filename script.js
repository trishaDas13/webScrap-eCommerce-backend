const axios = require("axios");
const cheerio = require('cheerio');
const xlsx = require('xlsx');

let laptopArr = [];

async function getData() {
  try {
    const res = await axios.get(
      "https://www.croma.com/computers-tablets/laptops/windows-laptops/c/855",
      {
        headers: {
          "content-type": "text/html",
        },
      }
    );
    const $ = cheerio.load(res.data);
    const cards = $("li.product-item")
    .each((idx, item)=>{
        const name = $(item).find("h3.product-title.plp-prod-title").text();
        const price = $(item).find("span.amount.plp-srp-new-amount").text();
        const oldPrice = $(item).find("span#old-price").text();
        const discountValue = $(item).find("span.dicount-value").text();
        const discountPercentage = $(item).find("span.discount.discount-mob-plp.discount-newsearch-plp").text();
        laptopArr.push({ name, price, oldPrice, discountValue, discountPercentage});
    });
    const workbook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(laptopArr);
    xlsx.utils.book_append_sheet(workbook, workSheet, "Sheet1");
    xlsx.writeFile(workbook, "output.xlsx");
  } catch (err) {
    console.log("error :" + err);
  }
}
getData();
