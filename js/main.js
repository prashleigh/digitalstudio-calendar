function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'AIzaSyBRjtNUliNuV4TMTH06sffXxInW0HLiIro',
        // clientId and scope are optional if auth is not required.
        'clientId': '158842763808-52v3sccas90s1par8vqdcgmr9d37frql.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/calendar.readonly',
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

let calendars = [];
let e;

function init() {
    calendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c4942524f43434f4e46313337313330323037313531333034@resource.calendar.google.com"));
    calendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c494244494744494749313630313630323232313834343038@resource.calendar.google.com"));
    calendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c494244494744494749313533313534313630323232313832353037@resource.calendar.google.com"));
    calendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c494244494744494749313538313630323232313833353433@resource.calendar.google.com"));
    calendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "brown.edu_4c494244494744494749313535313536313630323232313833303038@resource.calendar.google.com"));
    calendars.push(new Calendar("https://www.googleapis.com/calendar/v3", "digitalstudiobrown@gmail.com"));
    update();
    window.setInterval(update, 1000 * 60 * .1); // 30 minutes interval to update
}

async function update() {
    console.log("update")
    let events = [];

    let promises = [];
    for (let cal of calendars) {
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
            leftTime = new Date(left.event.start.dateTime);
            rightTime = new Date(right.event.start.dateTime);
            return leftTime < rightTime ? -1 : leftTime == rightTime ? 0 : 1;
        });
    
        document.getElementById("cal-display").innerHTML = "";
        for (let event of events) {
            let elTemplate = document.getElementById("calendar-block");
            elTemplate.content.querySelectorAll(".time")[0].textContent = (new Date(event.event.start.dateTime).toLocaleTimeString()) + " - " + (new Date(event.event.end.dateTime).toLocaleTimeString());
            elTemplate.content.querySelectorAll(".room")[0].textContent = event.calSummary;           
            elTemplate.content.querySelectorAll(".summary")[0].textContent = event.event.summary;
            let el = document.importNode(elTemplate.content, true);
            // el.innerHTML = "(" + new Date(event.event.start.dateTime).toLocaleString() + "): " + (event.calSummary || "No room specified") + " | " + (event.event.summary || "No summary provided.");
            document.getElementById("cal-display").appendChild(el);
        }
    });    
}