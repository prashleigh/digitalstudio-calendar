class CalendarDisplay {
    constructor(calendars, id) {
        this.calendars = calendars;
        this.id = id;
        this.update();
        window.setInterval(() => this.update(), 1000 * 60 * .1); // 10 second interval to update
    }

    async update() {
        let self = this;
        console.log("update")
        let events = [];

        let promises = [];
        console.log(this.calendars)
        for (let cal of this.calendars) {
            promises.push(
                new Promise(async function(resolve, reject) {
                    let results = await cal.eventsForToday;
                    for (let event of results.items) {
                        events.push({"event": event, "calSummary": results.summary});
                    }
                    resolve();
                })
                )
        }

        let promise = Promise.all(promises);

        promise.then(function() {
            events.sort(function(left, right) {
                let leftTime = new Date(left.event.start.dateTime);
                let rightTime = new Date(right.event.start.dateTime);
                return leftTime < rightTime ? -1 : leftTime == rightTime ? 0 : 1;
            });

            document.getElementById(self.id).innerHTML = "";
            if (events.length > 0) {
                for (let event of events) {
                    let elTemplate = document.getElementById("calendar-block");
                    elTemplate.content.querySelectorAll(".summary")[0].textContent = formatMessage(event, self.id)
                    let el = document.importNode(elTemplate.content, true);
                    // el.innerHTML = "(" + new Date(event.event.start.dateTime).toLocaleString() + "): " + (event.calSummary || "No room specified") + " | " + (event.event.summary || "No summary provided.");
                    document.getElementById(self.id).appendChild(el);
                }
            } else {
                document.getElementById(self.id).innerHTML = "Nothing left for today!";
            }
        });    
    }
}

class AllDayEvents extends CalendarDisplay{

    async update() {
        let self = this;
        console.log("update")
        let events = [];

        let promises = [];
        console.log(this.calendars)
        for (let cal of this.calendars) {
            promises.push(
                new Promise(async function(resolve, reject) {
                    let results = await cal.eventsForToday;
                    for (let event of results.items) {
                        if (event.start.date) {
                            console.log(event.start.date)
                            console.log(event.start.dateTime)
                            events.push({"event": event, "calSummary": results.summary});
                        }
                    }
                    resolve();
                })
                )
        }

        let promise = Promise.all(promises);

        promise.then(function() {

            document.getElementById(self.id).innerHTML = "";
            if (events.length > 0) {
                for (let event of events) {
                    let elTemplate = document.getElementById("calendar-block");
                    elTemplate.content.querySelectorAll(".summary")[0].textContent = formatMessage(event, self.id);
                    let el = document.importNode(elTemplate.content, true);
                    // el.innerHTML = "(" + new Date(event.event.start.dateTime).toLocaleString() + "): " + (event.calSummary || "No room specified") + " | " + (event.event.summary || "No summary provided.");
                    document.getElementById(self.id).appendChild(el);
                }
            } else {
                document.getElementById(self.id).innerHTML = "Nothing for today!";
            }
        });    
    }
}

class FutureEvents extends CalendarDisplay {

    async update() {
        let self = this;
        console.log("update")
        let events = [];

        let promises = [];
        console.log(this.calendars)
        for (let cal of this.calendars) {
            promises.push(
                new Promise(async function(resolve, reject) {
                    let results = await cal.futureEvents;
                    for (let event of results.items) {
                        if (event.start.dateTime) {
                            events.push({"event": event, "calSummary": results.summary});
                        }
                    }
                    resolve();
                })
                )
        }

        let promise = Promise.all(promises);

        promise.then(function() {
            events.sort(function(left, right) {
                let leftTime = new Date(left.event.start.dateTime);
                let rightTime = new Date(right.event.start.dateTime);
                return leftTime < rightTime ? -1 : leftTime == rightTime ? 0 : 1;
            });

            document.getElementById(self.id).innerHTML = "";
            if (events.length > 0) {
                for (let event of events) {
                    let elTemplate = document.getElementById("calendar-block");
                    elTemplate.content.querySelectorAll(".summary")[0].textContent = formatMessage(event, self.id)
                    let el = document.importNode(elTemplate.content, true);
                    // el.innerHTML = "(" + new Date(event.event.start.dateTime).toLocaleString() + "): " + (event.calSummary || "No room specified") + " | " + (event.event.summary || "No summary provided.");
                    document.getElementById(self.id).appendChild(el);
                }
            } else {
                document.getElementById(self.id).innerHTML = "No tasks right now!";
            }
        });    
    }
}

function formatDate(event, display) {
    switch (display) {
        case "cal-display":
            start = new Date(event.event.start.dateTime);
            end = new Date(event.event.end.dateTime);
            sh = start.getHours();
            sh = sh > 12 ? sh - 12 : sh;
            sm = start.getMinutes();
            sm = sm < 10 ? sm = "0" + sm : sm;
            eh = end.getHours();
            eh = eh > 12 ? eh - 12 : eh;
            em = end.getMinutes();
            em < 10 ? em = "0" + em : em;
            return sh + ":" + sm + " - " + eh + ":" + em;
        case "task-cal-display":
            start = new Date(event.event.start.dateTime).toLocaleString();
            start = start.replace("(:[^:]+):.*", "");
            return start;
        case "message-cal-display":
        default:
            return "";
    }
}


function formatMessage(event, display) {
    switch (display) {
        case "cal-display":
            console.log(event.calSummary)
            return event.event.summary + " (" + roomMap[event.calSummary] + " " + formatDate(event, display) + ")";
        case "message-cal-display":
            return event.event.summary
        case "task-cal-display":
            return event.event.summary + " " + formatDate(event, display)
        default:
            return "Unexpected Error in formatMessage";
    }
}


let task;
let roomMap = {}
function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        apiKey: 'AIzaSyBRjtNUliNuV4TMTH06sffXxInW0HLiIro',
        // clientId and scope are optional if auth is not required.
        clientId: '158842763808-52v3sccas90s1par8vqdcgmr9d37frql.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
    }).then(function() {
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            gapi.auth2.getAuthInstance().signIn().then(function() {
                init();
            });
        } else {
            init();
        }
        
    }, function() {
        alert("There was an erroring accessing the Google Calendar. Please clear your cache and refresh the page.");
    });
};

function init() {
    let generalCalendar = [];
    let eventCalendars = [];
    let shiftCalendars = [];
    eventCalendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c4942524f43434f4e46313337313330323037313531333034@resource.calendar.google.com"));
    eventCalendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c494244494744494749313630313630323232313834343038@resource.calendar.google.com"));
    eventCalendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c494244494744494749313533313534313630323232313832353037@resource.calendar.google.com"));
    eventCalendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c494244494744494749313538313630323232313833353433@resource.calendar.google.com"));
    eventCalendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c494244494744494749313535313536313630323232313833303038@resource.calendar.google.com"));
    generalCalendar.push(new Calendar("https://www.googleapis.com/calendar/v3", "digitalstudiobrown@gmail.com"));

    roomMap["LIB Rock DSL 137"] = "DSL"
    roomMap["LIB-Digital A/V Suite 153-154"] = "A/V Suite"
    roomMap["LIB-Digital Consulting Room 158"] = "Consulting Room"
    roomMap["LIB-Digital Seminar Room 160"] = "Seminar Room"
    roomMap["LIB-Digital Studio 155-156"] = "Digital Studio"

    let tasksCalendar = new FutureEvents(generalCalendar, "task-cal-display");
    let todayEvents = new CalendarDisplay(eventCalendars, "cal-display");
    let generalMessages = new AllDayEvents(generalCalendar, "message-cal-display");
}
