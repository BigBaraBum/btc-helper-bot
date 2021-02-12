require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const { Telegraf } = require("telegraf");

const { PORT = 3000, API_TOKEN } = process.env;
const bot = new Telegraf(API_TOKEN);
const app = express();
const sochainApiUrl = "https://sochain.com/api/v2/";
const testWallet = "3QE6nong2ZxXvMfzZC1pDUYhuTUkpLyJFT";
const confirmationsToWait = 34;

bot.start((ctx) => ctx.reply("Добро пожаловать! Отправь мне номер кошелька и я оповещу тебя когда зачислится"));
bot.on("text", async (ctx) => {
  const wallet = ctx.message.text.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/);
  console.log(ctx.message.text);
  if (wallet) {
    getWalletInfo(wallet, ctx);
  } else {
    ctx.reply("ne ponyatno");
  }
});

bot.launch();
app.listen(PORT, () => {
  console.log("App listening");
});
function getWalletInfo(wallet, ctx) {
  return fetch(`${sochainApiUrl}get_tx_received/bitcoin/${wallet}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.data.txs[0].confirmations < confirmationsToWait) {
        console.log(data.data.txs[0].confirmations)
        setTimeout(() => {
          getWalletInfo(wallet, ctx)
        }, 10000);

      } else {
        ctx.reply('Зачислено');
      }
    })

    .catch((err) => {});
}
