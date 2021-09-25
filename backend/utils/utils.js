exports.uuid = function (prefix) {
    return (prefix + 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}

exports.cronOffset = function (cronString, offSet) {
    let cronSplit = cronString.split(' ');
    let cronMinuteInt = parseInt(cronSplit[0].match(/\d+/));
    let cronHourInt = parseInt(cronSplit[1].match(/\d+/));
    let cronMinuteWithOffset = cronMinuteInt + parseInt(offSet);
    let newCronString = cronString.replace(cronSplit[0], cronMinuteWithOffset);
    if(cronMinuteWithOffset > 59) {
        let timeDiff = Math.abs(59 - cronMinuteInt - offSet);
        if(timeDiff > 0) {
            if(isNaN(cronHourInt) || cronHourInt >= 23) {
                cronSplit[0] = timeDiff -1;
                return cronSplit.join(' ');
            }
            cronHourInt = cronHourInt + 1;
            cronMinuteInt = timeDiff - 1;

            for (let i = 0; i < cronSplit.length; i++) {
                if(i === 0) {
                    cronSplit[i] = cronMinuteInt;
                } else if(i === 1) {
                    cronSplit[i] = cronHourInt;
                }
            }
            newCronString = cronSplit.join(' ')
        }
    }

    return newCronString;
}

const cronAction = exports.cronAction = {
    START: "running",
    STOP: "stopped",
    WAITING: "waiting"
}
