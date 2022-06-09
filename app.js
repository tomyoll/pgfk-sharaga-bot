const express = require('express');
require('dotenv').config();
const cors = require('cors');
const db = require('./helpers/db');
const indexRouter = require('./routes/');
const morgan = require('morgan');
const cronJobs = require('./helpers/bot/crons');

const { parseArchiveDate } = require('./helpers/');

const NavigationProvider = require('./providers/navigation.provider');
const LinkProvider = require('./providers/link.provider');
const AllNewsProvider = require('./providers/allNewsProvider');

const { Telegraf, Markup } = require('telegraf');

const { getMainMenu, getSubNavigation, archiveKeyboard } = require('./helpers/bot/keyboards');

const parser = require('./parser/parser');
const userStateProvider = require('./providers/userState.provider');
const userProvider = require('./providers/user.provider');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(indexRouter);

(async () => await db())();
const bot = new Telegraf(TOKEN, { handlerTimeout: 1000000000 });

cronJobs.setup();

bot.start(async (ctx) => {
  const navigation = await NavigationProvider.getNavigationTitles();
  ctx.reply('Меню', getMainMenu(navigation));
  const userId = ctx.from.id;
  const userState = userStateProvider.getSingle({ user: userId });

  if (userState) {
    await userStateProvider.createSingle({ user: userId, keyboardState: 'MainMenu' });
  }

  const telegramId = ctx.from.id;
  const chatId = ctx.chat.id;
  const userName = ctx.from.username;

  const existingUser = await userProvider.getSingle({ chatId });

  console.log({ telegramId, userName, chatId });

  if (!existingUser) {
    await userProvider.createSingle({ telegramId, userName, chatId });
  }
});

bot.command('setNav', async (ctx) => {
  await parser.setNavigation();
});

bot.command('actualNews', async (ctx) => {
  await parser.getActualNews();
});

bot.command('allNews', async (ctx) => {
  await parser.getAllNews();
});

bot.command('checkUpdates', async (ctx) => {
  await parser.checkUpdates();
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
  ctx.reply('Оберіть, що вас цікавить', getMainMenu(navigation));
  ctx.deleteMessage(oldMessage);
});

bot.on('message', (ctx) => {
  console.log(ctx);
});

const sendMessage = (payload, chats) => {
  chats.forEach(async ({ chatId }) => await bot.telegram.sendMessage(chatId, payload));
};

const stop = () => {
  bot.stop();
};

const launch = () => {
  bot.launch();
};

bot.launch();

app.listen(PORT, () => console.log(`♂️ ♂️ ♂️ Server is running on port ${PORT} ♂️ ♂️ ♂️`));

app.get('/', (req, res) => res.send('work'));

module.exports.stop = stop;
module.exports.sendMessage = sendMessage;
module.exports.launch = launch;
