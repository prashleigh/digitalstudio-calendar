"use script"

class Calendar {
    constructor(apiLocation, calendarId) {
        this.location = apiLocation;
        this.id = calendarId;    
        this.endDate = null;
    }

    get eventsForToday() {
        let self = this;
        return new Promise(function(resolve, reject) {
            let date = new Date();
            let startDate = date;
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

    get futureEvents() {
        let self = this;
        return new Promise(function(resolve, reject) {
            let date = new Date();
            let startDate = date;
            let path = new URL(self.location + "/calendars/" + self.id + "/events");
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

    wrapperUntil(time) {
        this.endDate = time;
    }

    get eventsUntil() {
        // Takes in a date object
        let self = this;
        return new Promise(function(resolve, reject) {
            let date = new Date();
            let startDate = date;
            let endDate = self.endDate;
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

