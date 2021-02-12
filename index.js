require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const { Telegraf } = require("telegraf");

const { PORT = 3000, API_TOKEN } = process.env;
const bot = new Telegraf(API_TOKEN);
const app = express();
const sochainApiUrl = "https://sochain.com/api/v2/";
const testWallet = "3QE6nong2ZxXvMfzZC1pDUYhuTUkpLyJFT";
const confirmationsToWait = 2;
const adminId = "917608881";
const bublikId = "242711641";

bot.start((ctx) => ctx.reply(`Добро пожаловать, ${ctx.from.first_name}! Отправь мне номер кошелька и я оповещу тебя когда зачислится`));
bot.on("text", async (ctx) => {
  if (ctx.from.id == adminId) {
    //ctx.forwardMessage(bublikId)
  } else {
    ctx.forwardMessage(adminId);
  }
  console.log(ctx.message.text);
  console.log(ctx.from);
  if (ctx.message.text.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
    ctx.reply(` ${ctx.from.first_name}, я оповещу тебя когда транзакция на кошелек ${ctx.message.text} получит ${confirmationsToWait} подтверждений`);
    getWalletInfo(ctx);
  } else {
    ctx.reply("Я не знаю такой команды :(");
  }
});

bot.launch();
app.get("/wallet:wallet", (req, res) => {
  const { wallet } = req.params;
});
app.listen(PORT, () => {
  console.log("App listening");
});
function getWalletInfo(ctx) {
  return fetch(`${sochainApiUrl}get_tx_received/bitcoin/${ctx.message.text}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.data.txs[0].confirmations < confirmationsToWait) {
        console.log(data.data.txs[0].confirmations);
        setTimeout(() => {
          getWalletInfo(wallet, ctx);
        }, 10000);
      } else {
        ctx.reply("Зачислено");
      }
    })

    .catch((err) => {});
}
