const { getBrowser } = require('./utils/get-browser')
const CronJob = require('cron').CronJob

const QUEUE_NAME = 'tasks'
const QUEUE_CONNECTION_STRING = 'amqp://queue'
const connection = require('amqplib').connect(QUEUE_CONNECTION_STRING)
const MESSAGE_TYPES = {
  REGULAR: 'regular',
  CRONTAB: 'crontab',
}

const CRON_ACTIONS = {
  START: 'start',
  STOP: 'stop',
}

// Consumer
connection
  .then(function (conn) {
    return conn.createChannel()
  })
  .then(function (ch) {
    return ch.assertQueue(QUEUE_NAME).then(function (ok) {
      return ch.consume(QUEUE_NAME, function (msg) {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString())
          console.log("🚀 ~ file: index.js ~ line 27 ~ content", content)

         
          processMessage(content);
           ch.ack(msg)
        }
      })
    })
  })
  .catch(console.warn)

function processMessage(message) {
  if (message.type === MESSAGE_TYPES.REGULAR) {
    return processImmediatetly(message.payload.asin)
  }

  return processCronMessage(message.payload);
}

function processImmediatetly(asin) {
  getBrowser(asin)
}

function processCronMessage(payload) {
  console.log("🚀 ~ file: index.js ~ line 52 ~ processCronMessage ~ payload", payload)
  const {asin, action, crontab} = payload
  if (action === CRON_ACTIONS.START) {
    return startCronTask(asin, crontab)
  }

  return stopCronTask(asin);
}

const cronTaskMap = new Map()

function startCronTask(asin, crontab) {
  let task = cronTaskMap.get(asin)
  if (!task) {
    task = new CronJob(crontab, function () {
      getBrowser(asin)
    })
    cronTaskMap.set(asin, task)
  }

  task.start()
}

function stopCronTask(asin) {
  const task = cronTaskMap.get(asin)
  if (!task) {
    console.warn(`CRAWLER: task for asin:"${asin}" is was not found`)
  }

  task.stop()
}
