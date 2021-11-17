exports.cleanupTimers = function  (db) {
    // schedule every hour to delete old timers where the endDate is greater than 24 hours, minimum amount of timers 10
    setInterval(() => {
            const timers = JSON.parse(JSON.stringify(db.get("timer")));
            const now = new Date();
            const timersToDelete = timers.filter(timer => timer.endDate + 60 * 60 * 1000 < now.getTime() && timer.completed);
            for (let i = 0; i < timersToDelete.length; i++) {
                if (timers.length > 2) {
                    db.get("timer").remove({id: timersToDelete[i].id}).write();
                }
            }
        },
        60 * 1000
    );
}
