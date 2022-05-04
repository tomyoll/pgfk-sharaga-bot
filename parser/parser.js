const { chromium } = require('playwright');
const { ObjectId } = require('../providers/navigation.provider');

const NavigationProvider = require('../providers/navigation.provider');
const LinkProvider = require('../providers/link.provider');
const ActualNewsProvdier = require('../providers/actualNewsProvider');
const AllNewsProvider = require('../providers/allNewsProvider');

class Parser {
  constructor() {
    this.context = {};
    (async () => {
      const browser = await chromium.launch();
      this.context = await browser.newContext();
      await this.context.newPage();
    })();
  }

  async getPagesCount(page) {
    const pagesCount = await page.evaluate(() => {
      return Array.from(document.getElementsByClassName('page-numbers'))[4].innerText;
    });

    return Number(pagesCount);
  }

  async getActualNews() {
    const page = await this.context.newPage();
    await page.goto(`https://www.college.uzhnu.edu.ua`);

    const actualNews = await page.evaluate(() => {
      const news = document.getElementsByClassName('bxcarousel');
      const newsList = Array.from(news[0].childNodes);

      return newsList.map((i) => {
        const data = i.querySelector('a');
        const image = data.querySelector('img');
        const description = data.getElementsByClassName('n_co_c');

        return {
          title: image.title,
          description: description[0].innerText,
          image: image.currentSrc,
          link: data.href,
        };
      });
    });

    await page.close();
    const links = actualNews.map((item) => item.link);
    const checkExist = await ActualNewsProvdier.getMany({ link: links });
    if (checkExist) {
      await ActualNewsProvdier.deleteMany({});
      await ActualNewsProvdier.createMany(actualNews).catch((e) => console.log(e.message));
      console.log('success');
    }
    return actualNews;
  }

  async getNewsOnPage(pageNumber) {
    const page = await this.context.newPage();
    await page.goto(`https://www.college.uzhnu.edu.ua/page/${pageNumber}`);

    const newsOnPage = await page.evaluate(() => {
      const newsItems = Array.from(document.querySelectorAll('#main .row article a'));

      return newsItems.map((item) => {
        const thumb = item.getElementsByClassName('featured-thumb')[0];
        const image = thumb.querySelector('img').dataset.src;
        const tags = Array.from(thumb.querySelectorAll('.cat_p p')).map((i) => i.innerText);
        const title = item.getElementsByClassName('n_co_t')[0].innerText;
        const description = item.getElementsByClassName('n_co_c')[0].innerText;
        const date = item.getElementsByClassName('meta-date')[0].innerText;
        const year = date ? +date.split('.')[2] : null;
        const month = date ? +date.split('.')[1] : null;
        const link = item.href;

        return {
          title,
          description,
          tags,
          image,
          date,
          year,
          month,
          link,
        };
      });
    });
    console.log(newsOnPage.forEach((i) => console.log({ year: i.year, month: i.month })));
    console.log({ year: newsOnPage.year, month: newsOnPage.month });
    await page.close();
    return newsOnPage;
  }

  async getAllNews() {
    try {
      const page = await this.context.newPage();
      await page.goto(`https://www.college.uzhnu.edu.ua`);

      const pagesCount = await this.getPagesCount(page);
      await AllNewsProvider.deleteMany({});
      for (let i = 0; i <= pagesCount; i++) {
        const newsOnPage = await this.getNewsOnPage(i);

        console.log(
          `=========================== News frome page #${i} ===========================`
        );
        await AllNewsProvider.createSingle(newsOnPage);
      }

      await page.close();
    } catch (e) {
      console.log(e.message);
    }
  }

  async setNavigation() {
    const page = await this.context.newPage();
    await page.goto('https://www.college.uzhnu.edu.ua');

    const topMenu = await page.evaluate(() => {
      const navigationList = Array.from(
        document.querySelectorAll('#top-nav #site-navigation ul#menu-up-menu>li')
      );

      return navigationList.map((i) => {
        const list = i.querySelector('li > ul');

        if (!list) {
          return {
            title: i.querySelector('a').text,
            value: [
              {
                url: i.querySelector('a').href,
              },
            ],
          };
        } else {
          const subElements = [];
          Array.from(list.querySelectorAll('li > a')).map((j) => {
            subElements.push({ title: j.text, url: j.href });
          });
          return {
            title: i.querySelector('a').text,
            value: subElements,
          };
        }
      });
    });
    await page.close();
    await this._saveNavigation(topMenu);
  }

  async _saveNavigation(topMenu) {
    const linksArray = [];
    topMenu.forEach((item) => {
      item.value.forEach((i) => {
        const linkId = NavigationProvider.ObjectId();
        linksArray.push({ _id: linkId, url: i.url });
        i.url = linkId;
      });
    });
    await LinkProvider.createMany(linksArray);
    await NavigationProvider.createMany(topMenu);
  }
}

module.exports = new Parser();
