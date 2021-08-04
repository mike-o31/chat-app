const moment = require('moment')

const messageFormat = (name, message) => {
   return {
       name: name,
       message: message,
       time: moment().format('h:mm a')
   }
}

module.exports = messageFormat