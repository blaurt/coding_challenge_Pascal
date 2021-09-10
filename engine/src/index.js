const express = require('express')
const app = express()
app.use(express.json())

const { QueueService} = require('./services/queue.service');
const queueService = new QueueService('amqp://queue')

app.get('/', function(req, res) {
  res.send('emax.digital coding challenge')
})

app.get('/get-title', function(req, res) {
  const asin = req.query.asin;
  console.log("🚀 ~ ENGINE (one time): asin", asin)
  queueService.addOneTimeTask(asin);
  res.send({status: 200, message: 'Regular crawl-request (most probably) accepted :D'})
})

app.post('/get-title-scheduled', function(req, res) {
  const {asin, crontab, action} = req.body;
  console.log("🚀 ~ ENGINE (scheduled): asin", asin)
  queueService.addCronTask(asin, crontab, action);
  res.send({status: 200, message: 'Cron-based crawl-request (most probably) accepted :D'})
})


app.listen(3030)
