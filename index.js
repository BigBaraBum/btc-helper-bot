require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const { Telegraf } = require("telegraf");

const { PORT = 3000, API_TOKEN } = process.env;
const bot = new Telegraf(API_TOKEN);
const app = express();
const sochainApiUrl = "https://sochain.com/api/v2/";
const testWallet = "3LbbXugJpmz8QybSuLfFMnQgxNLKJCyFP5";

bot.start((ctx) => ctx.reply("Добро пожаловать! Отправь мне номер транзакции и я оповещу тебя когда зачислится"));

bot.launch();
app.listen(PORT, () => {
  console.log("App listening");

  getWalletInfo(testWallet)

});
function getWalletInfo(wallet) {

   return fetch(`${sochainApiUrl}address/bitcoin/${wallet}`)
    .then((res) => {
      return res.json();
    })
    .then((data)=>{
      console.log(data)
    })

    .catch((err) => {});
}
