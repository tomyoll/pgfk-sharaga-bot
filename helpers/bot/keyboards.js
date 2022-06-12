const { Markup } = require('telegraf');

function getMainMenu(navigation) {
  const buttonsArray = navigation.map((item) =>
    Markup.button.callback(item.title, JSON.stringify({ main_menu: item._id }))
  );
  return Markup.inlineKeyboard(buttonsArray, { columns: 2 }).resize();
}

function getSubNavigation(navigation) {
  const buttonsArray = navigation.value.map((item) => {
    return Markup.button.callback(
      item.title || navigation.title,
      JSON.stringify({ page: item.url })
    );
  });

  if (navigation.title === 'Новини') {
    buttonsArray.push(Markup.button.callback('Архів', 'newsArchive'));
  }

  buttonsArray.push(Markup.button.callback('Назад', 'back'));

  return Markup.inlineKeyboard(buttonsArray, { columns: 2 }).resize();
}

function archiveKeyboard(archive) {
  const buttonsArray = archive.map(({ month, year, textMonth }) => {
    return Markup.button.callback(
      `${textMonth} ${year}`,
      JSON.stringify({ arch: { m: month, y: year } })
    );
  });

  buttonsArray.push(Markup.button.callback('Назад', 'back'));

  return Markup.inlineKeyboard(buttonsArray, { columns: 3 }).resize();
}

module.exports = {
  getMainMenu,
  getSubNavigation,
  archiveKeyboard,
};
