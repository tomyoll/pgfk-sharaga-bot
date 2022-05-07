const { CronJob } = require('cron');
const parser = require('../../parser/parser');

function setup() {
  console.log('===== START CRON JOBS ======');

  const cronJobs = [
    // {
    //   name: 'Parse all news',
    //   cronSetting: `1 * * * * *`,
    //   action: async () => {
    //     await parser.getActualNews(), console.log('run');
    //   },
    // },
  ];

  for (let i = 0; i < cronJobs.length; i++) {
    const job = cronJobs[i];

    const cronJob = new CronJob(job.cronSetting, async () => {
      try {
        await job.action();
      } catch (e) {
        console.log(`Error in : ${job.name}`);

        console.log(e);
      }
    });

    cronJob.start();
  }
}

module.exports = {
  setup,
};
