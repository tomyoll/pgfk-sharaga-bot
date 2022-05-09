const express = require('express');
require('dotenv').config();
const db = require('./helpers/db');
const fs = require('fs');

const cronJobs = require('./helpers/bot/crons');

const { parseArchiveDate } = require('./helpers/');

const NavigationProvider = require('./providers/navigation.provider');
const LinkProvider = require('./providers/link.provider');
const AllNewsProvider = require('./providers/allNewsProvider');
const UserStateProvider = require('./providers/userState.provider');

const { Telegraf, Markup, Extra } = require('telegraf');

let { MAIN_NAVIGATION } = require('./helpers/bot/buttonNames');

const { getMainMenu, getSubNavigation, archiveKeyboard } = require('./helpers/bot/keyboards');

const parser = require('./parser/parser');
const userStateProvider = require('./providers/userState.provider');
const { json } = require('express/lib/response');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

const app = express();
(async () => await db())();
const bot = new Telegraf(TOKEN);
cronJobs.setup();

bot.start(async (ctx) => {
  const navigation = await NavigationProvider.getNavigationTitles();
  ctx.reply('Меню', getMainMenu(navigation));
  const userId = ctx.from.id;
  const userState = userStateProvider.getSingle({ user: userId });

  if (userState) {
    await userStateProvider.createSingle({ user: userId, keyboardState: 'MainMenu' });
  }
});

bot.command('setNav', async (ctx) => {
  await parser.setNavigation();
  ctx.reply('success');
});

bot.command('actualNews', async (ctx) => {
  await parser.getActualNews();
  ctx.reply('success');
});

bot.command('allNews', async (ctx) => {
  await parser.getAllNews();
  ctx.reply('success');
});

bot.command('checkUpdates', async (ctx) => {
  await parser.checkUpdates();
  ctx.reply('success');
});

bot.command('getNav', async (ctx) => {
  const navigation = await NavigationProvider.getNavigationTitles();
  ctx.reply('Меню', getMainMenu(navigation));
  const userId = ctx.from.id;
  await userStateProvider.updateSingle({ user: userId }, { keyboardState: 'MainMenu' });
});

bot.command('clear', (ctx) => {
  ctx.reply('clear', Markup.removeKeyboard());
});

bot.action(/{"main_menu":+/, async (ctx) => {
  const callbackData = JSON.parse(ctx.update.callback_query.data);
  const oldMessage = ctx.update.callback_query.message.message_id;
  const document = await NavigationProvider.getSingleById(callbackData.main_menu);
  ctx.deleteMessage(oldMessage);
  ctx.reply('Оберіть, що вас цікавить', getSubNavigation(document));
  await userStateProvider.updateSingle({ user: ctx.from.id }, { keyboardState: 'SubNavigation' });
});

bot.action('back', async (ctx) => {
  const userId = ctx.from.id;
  const userState = await userStateProvider.getSingle({ user: userId });

  switch (userState.keyboardState) {
    case 'SubNavigation':
      const navigation = await NavigationProvider.getNavigationTitles();
      const oldMessage = ctx.callbackQuery.message.message_id;
      ctx.deleteMessage(oldMessage);

      ctx.reply('Оберіть, що вас цікавить', getMainMenu(navigation));
      break;
  }
});

bot.action(/{"page":+/, async (ctx) => {
  const callbackData = JSON.parse(ctx.update.callback_query.data);
  const oldMessage = ctx.update.callback_query.message.message_id;
  const pageLink = await LinkProvider.getSingleById(callbackData.page);
  console.log(pageLink);
  ctx.reply(pageLink.url);
  console.log(callbackData);
});

bot.action('newsArchive', async (ctx) => {
  const archive = [];
  const oldMessage = ctx.update.callback_query.message.message_id;
  const lastYear = await AllNewsProvider.getSingle({}, { year: 1 }, { sort: { year: -1 } });
  for (let i = 15; i <= lastYear.year; i++) {
    for (j = 1; j <= 12; j++) {
      archive.push({ month: j, year: `20${i}` });
    }
  }
  console.log(archive);
  ctx.deleteMessage(oldMessage);
  ctx.reply('Архів новин', archiveKeyboard(parseArchiveDate(archive.slice(7))));
});

bot.action(/{"arch":+/, async (ctx) => {
  const navigation = await NavigationProvider.getNavigationTitles();
  const oldMessage = ctx.update.callback_query.message.message_id;
  const { arch } = JSON.parse(ctx.update.callback_query.data);
  const news = await AllNewsProvider.getMany(
    { month: arch.m, year: +arch.y.slice(2) },
    { link: 1, title: 1, image: 1 }
  );
  for (let i = 0; i <= news.length - 1; i++) {
    const newsItem = news[i];
    const linkItem = `${newsItem.title}: ${newsItem.link}`;
    try {
      await ctx.replyWithPhoto({ url: newsItem.image }, { caption: linkItem });
    } catch (e) {
      console.log(e.message);
      await ctx.reply(linkItem);
    }
  }
  ctx.deleteMessage(oldMessage);
  ctx.reply('Оберіть, що вас цікавить', getMainMenu(navigation));
});

bot.on('message', (ctx) => {
  console.log(ctx);
});

bot.launch();

app.listen(PORT, () => console.log(`♂️ ♂️ ♂️ Server is running on port ${PORT} ♂️ ♂️ ♂️`));

app.get('/', (req, res) => res.send('work'));
