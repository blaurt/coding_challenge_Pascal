const QUEUE_NAME = 'tasks'

const MESSAGE_TYPES = {
  REGULAR: 'regular',
  CRONTAB: 'crontab'
}

class QueueService {

  constructor(queueConnectionString) {
    this.connection = require('amqplib').connect(queueConnectionString)
  }

  addOneTimeTask(asin) {
    // Publisher
    this.connection
      .then(function (conn) {
        return conn.createChannel()
      })
      .then( (channel)=> {
        return channel.assertQueue(QUEUE_NAME).then( (ok)=> {
          return channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(this.createPayload(MESSAGE_TYPES.REGULAR, {asin}))))
        })
      })
      
      .catch(console.warn)
  }

  addCronTask(asin,crontab, action ) {
    // Publisher
    this.connection
      .then(function (conn) {
        return conn.createChannel()
      })
      .then( (channel)=> {
        return channel.assertQueue(QUEUE_NAME).then( (ok)=> {
          return channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(this.createPayload(MESSAGE_TYPES.CRONTAB, {asin, crontab, action}))))
        })
      })
      
      .catch(console.warn)
  }

  createPayload(type, payload) {
    return {
      type,
      payload: {
        ...payload
      }
    }
  }
}

module.exports = {
    QueueService
}