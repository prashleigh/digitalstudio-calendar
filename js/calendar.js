"use script"

class Calendar {
    constructor(apiLocation, calendarId) {
        this.location = apiLocation;
        this.id = calendarId;    
    }

    get eventsForToday() {
        let self = this;
        return new Promise(function(resolve, reject) {
            let date = new Date();
            let startDate = date;
            // startDate.setHours(0);
            // startDate.setMinutes(0);
            // startDate.setSeconds(0);
            let endDate = new Date(date);
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            let path = new URL(self.location + "/calendars/" + self.id + "/events");
            path.searchParams.append("timeMax", endDate.toISOString());
            path.searchParams.append("timeMin", startDate.toISOString());
            path.searchParams.append("singleEvents", "true");
            gapi.client.request({
                "path": path.toString()
            }).then(function(response) {
                resolve(response.result);
            },
            function(reason) {
                reject(reason);
            });
        });
    }
}

