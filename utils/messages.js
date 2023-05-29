const moment = require ('moment');
// because we installed moment on our command now we able to use moment,
// moment will give us the ability to display time on our chat log

function formatMessage (username, text){
    return {
        username,
        text,
        time: moment().format('h:mm a')
        // for time use moment, by formating hour and minutes
    }
}

module.exports = formatMessage