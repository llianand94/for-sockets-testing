const btn = document.getElementById("btn");
const btnAddComment = document.getElementById("btn add-comment");
const btnEditComment = document.getElementById("btn edit-comment");
const btnGetComments = document.getElementById("btn get-comments");
const btnDeleteComment = document.getElementById("btn delete-comment");
const btnReplyComment = document.getElementById("btn reply-comment");

const btnAddLocation = document.getElementById("btn add-user-geo");
const btnGetLocations = document.getElementById("btn get-users-geo");

const btnUpvote = document.getElementById("btn upvote");
const btnCancelVote = document.getElementById("btn cancel-vote");
const btnGetIncident = document.getElementById("btn get-incident");
const btnCreateIncident = document.getElementById("btn create-incident");

const btnCreateReport = document.getElementById("btn create-report");

let CURRENT_INCIDENT_ID = "64141bce263ba4da883aa17b"
let CURRENT_USER_ID = "641c716b87616e6cbeb9936f"; //63e4b001c65e6c11c50cd3e3
let CURRENT_CLIENT_PHONE =  "+12222229"; //"+380995433446"

const EIncidentType = {
  GUN_VIOLENCE: "gun-violence",
  OTHER_VIOLENCE: "other-violence",
  FIRE: "fire",
  FLOODING: "flooding",
  UNCONSCIOUS: "unconscious",
  CHILD_RELATED: "child-related",
  ACCIDENT: "accident",
  OTHER: "other"
}

const EnumMethod = {
  CLICK : "click",
  UPVOTE : "upvote",
  CANCEL_VOTE: "cancel-vote",
  REFRESH: "refresh",
  CONNECTION: "connection",

  ADD_USER_GEO: "add-user-geo",
  GET_USERS_GEO: "get-users-geo",

  EDIT_COMMENT: "edit-comment",
  GET_COMMENTS: "get-comments",
  CREATE_COMMENT: "create-comment",
  DELETE_COMMENT: "delete-comment",
  REPLY_COMMENT: "reply-comment",

  GET_INCIDENT: "get-incident",
  GET_INCIDENTS: "get-incidents",
  CREATE_INCIDENT: "create-incident",
  GET_SCHEDULED_INC: "get-scheduled-incidents",

  CREATE_REPORT: "create-report",
  GET_REPORTS: "get-reports",
  SEND_NOTIFICATION: "send-notification",

  VALIDATION_ERROR: "validation-error"
}
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}



/* Incidents */
let sIncidents;
let count = 0;
function connectIncidents() {
  // document.cookie = "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRiMDAxYzY1ZTZjMTFjNTBjZDNlMyIsInBob25lIjoiKzM4MDY4NDU2MDU4MSIsImlhdCI6MTY4MTk4OTc3OSwiZXhwIjoxNjgxOTkxNTc5fQ.GrABCWJ3zy36l-2wfI3vNmyKNVNggeBiqmt86BuG6EQ; Path=/; Secure; HttpOnly; Expires=Thu, 20 Apr 2023 11:52:59 GMT;";
  // document.cookie = "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRiMDAxYzY1ZTZjMTFjNTBjZDNlMyIsInBob25lIjoiKzM4MDY4NDU2MDU4MSIsImlhdCI6MTY4MTk4OTc3OSwiZXhwIjoxNjgyNTk0NTc5fQ.2kfXHW4FC0wttVZWt8jWg7NPaFJVp2uEmR9YC74fxi0; Path=/; Secure; HttpOnly; Expires=Thu, 27 Apr 2023 11:22:59 GMT;"
  // const headers = new Headers();
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTRiMDAxYzY1ZTZjMTFjNTBjZDNlMyIsInBob25lIjoiKzM4MDY4NDU2MDU4MSIsImlhdCI6MTY4MTk4MjE1OSwiZXhwIjoxNjgxOTgzOTU5fQ.EA9xSZz1m-nNV3AUwwJxowhxvLq7qa9E6MAbRJqC7ow";
  // headers.append("Authorization", token)
  // fetch("http://localhost:5000/api/refresh", {
  //   method: "GET",
  //   headers: headers,
  //   credentials: "include"});




  // sIncidents =  new WebSocket("ws://meercat-backend.herokuapp.com/api/incidents");
  sIncidents = new WebSocket("ws://localhost:3000");


  sIncidents.onopen = () => {
    console.log("WS listening /incidents from client")

    setTimeout(function () { //send message from Client
      sIncidents.send(JSON.stringify({
        id: 230, method: EnumMethod.REFRESH,
        phone: CURRENT_CLIENT_PHONE,
        userId: CURRENT_USER_ID
      }));
    }, 5000);
  }
  //get message from Server
  sIncidents.onmessage = (msg) => {

    msg = isJson(msg.data) && JSON.parse(msg.data);
    const {method, data, error, ...rest } = msg;
    // const {method, data,...rest} = isJson(msg) && JSON.parse(msg.data);
    console.log("/incidents", { method });
    // here is the constant trigger "refresh" action )
    if (method === "refresh") {
      setTimeout(function () {
        sIncidents.send(JSON.stringify({
          id: 231, method: "refresh",
          userId: CURRENT_USER_ID
        }));
      }, 5000);

    } else if (method === EnumMethod.VALIDATION_ERROR || error) {
      console.log("=>Error", error)
    } else {
      console.log("=> was got a uncaught method '", method, "' /incidents route", {time: new Date().toLocaleTimeString(), data, rest, error})
    }
  }
  sIncidents.onclose = (ev) => {
    console.log("Socket is closed, reconnect after 2s: ", ev.reason);
    console.log("=>", count);
    if (count < 2) {
      setTimeout(function () {
        connectIncidents();
        count++;
      }, 5000)
    }
  }
}
connectIncidents();
/************************************************/


/* Notifications */
let sNotifications;
function connect() {
  // sNotifications = new WebSocket("ws://meercat-backend.herokuapp.com/api/notifications");
  sNotifications = new WebSocket("ws://localhost:5000/api/notifications");

  sNotifications.onopen = () => {

    // here is the first trigger "refresh" action
    setTimeout(function () {
      sNotifications.send(JSON.stringify({
        id: 230,
        method: EnumMethod.REFRESH,
        phone: CURRENT_CLIENT_PHONE,
        userId: CURRENT_USER_ID
      }));
    },5000);

    console.log("WS listening /notifications from client");
  }

  sNotifications.onmessage = (msg) => {
    const { method } = isJson(msg.data) && JSON.parse(msg.data);

    // here is the constant trigger "refresh" action )
    switch (method) {
      case EnumMethod.REFRESH: {
        setTimeout(function () {
          sNotifications.send(JSON.stringify({
            id: 231, method: EnumMethod.REFRESH
          }));
        },5000);
        break;
      }
      case EnumMethod.SEND_NOTIFICATION: {
        console.log("Sent notification: =>", msg.data)
        break;
      }
      default:
        console.log("Notification from Server:", msg.data);
    }
  }

  sNotifications.onclose = (ev) => {
    console.log("Socket is closed, reconnect after 2s: ", ev.reason);
    console.log("=>", count);
    if (count < 2) {
      setTimeout(function () {
        connect();
        count++;
      }, 5000)
    }
  }
}

connect();


//buttons
//send message from Client
btn.addEventListener("click", (event) => {
  sIncidents.send(JSON.stringify({
    id: 2222,
    method: EnumMethod.GET_INCIDENTS,
    data: {
      periodFilter:  new Date().valueOf() - 10*24*60*60*1000,
      type: [6],

      // center: { lat: 32.640188, lng: -96.786989},
      // bounds: {
      //   north: 33,
      //   south: 31,
      //   west: -96,
      //   east: -97
      // }
    }
  }))
})

btnAddLocation.addEventListener("click", () => {
  sIncidents.send(JSON.stringify({
    id: 1,
    method: EnumMethod.ADD_USER_GEO,
    data: {
      userId: CURRENT_USER_ID,
      latitude: 21,
      longitude: 103
    }
  }))
});
btnGetLocations.addEventListener("click", () => {
  sIncidents.send(JSON.stringify({
    method: EnumMethod.GET_USERS_GEO,
    data: {
      // center: { lat: 32.640188, lng: -96.786989},
      // bounds: {
      //   north: 33,
      //   south: 31,
      //   west: -96,
      //   east: -97
      // }
    }
  }))
});

/* comments */
btnAddComment.addEventListener("click", ()=>{
  sIncidents.send(JSON.stringify({
    id: 2, //here need to uuid()   v4
    method: EnumMethod.CREATE_COMMENT,
    data: {
      text: "Any test text with comment , find room 1",

      // userId: CURRENT_USER_ID, //was required
      incidentId: CURRENT_INCIDENT_ID,
    }  }))
})

btnEditComment.addEventListener("click", ()=>{
  sIncidents.send(JSON.stringify({
    id: 2, //here need to uuid()   v4
    method: EnumMethod.EDIT_COMMENT,
    data: {
      text: "Any test text with comment, change 2",
      id: "640abe3dc33ea3f21f213187",
      // "6409e188c93224f78ed1c671", repliedTo
      // userId: CURRENT_USER_ID, //was required
    }
  }))
})

btnGetComments.addEventListener("click", () => {
  sIncidents.send(JSON.stringify({
    id: 5, //here need to uuid()   v4
    method: EnumMethod.GET_COMMENTS,
    data: {
      // limit: 4, //optionally
      // offset: 4, //optionally
      userId: CURRENT_USER_ID, //optionally
      incidentId: CURRENT_INCIDENT_ID
    }
  }))
})
btnDeleteComment.addEventListener("click", ()=>{
  sIncidents.send(JSON.stringify({
    id: 2, //here need to uuid()   v4
    method: EnumMethod.DELETE_COMMENT,
    data: {
      userId: CURRENT_USER_ID,
      id: "63ed423dafa2aa23e83dd3b6"
    }
  }))
}) //63ef3dacea89572883a432ea comm id
btnReplyComment.addEventListener("click", ()=>{
  sIncidents.send(JSON.stringify({
    id: 2, //here need to uuid()   v4
    method: EnumMethod.REPLY_COMMENT,
    data: {
      text: "reply to comment 2",
      userId: CURRENT_USER_ID,
      incidentId: CURRENT_INCIDENT_ID,
      commentId: "640ab20116bc2a8005e7668d"
    }  }))
})


/* Votes */
btnUpvote.addEventListener("click", () => {
  sIncidents.send(JSON.stringify({
    id: 7, //here need to uuid()   v4
    method: EnumMethod.UPVOTE,
    data: {  userId: CURRENT_USER_ID, incidentId: CURRENT_INCIDENT_ID }
  }))
})
// 63c1cbfa53f6f77cf64f4b27 my
btnCancelVote.addEventListener("click", () => {
  sIncidents.send(JSON.stringify({
    id: 3,
    method: EnumMethod.CANCEL_VOTE,

    data: { incidentId: CURRENT_INCIDENT_ID, userId: CURRENT_USER_ID, }
  }))
})
btnGetIncident.addEventListener("click", () => {
  sIncidents.send(JSON.stringify({
    id: 9,
    method: EnumMethod.GET_INCIDENT,
    data: {
      incidentId: "63e536fb7ec104ca5eaebf8c",
       }
  }))
})

btnCreateIncident.addEventListener("click", () => {
  // const nextDate = new Date().valueOf() + 10 * 1000;

  sIncidents.send(JSON.stringify({
    id: 9,
    method: EnumMethod.CREATE_INCIDENT,
    data: {
      // userId: "63e4b001c65e6c11c50cd3e3",
      // latitude: 51.36531829625538,
      // longitude: 26.564196077212472,,
      latitude: 49.83847436160693,
      longitude: 24.034429551258317,
      // description: "incident next to Station1 find Notif + reporter",
      description: "setting incidents into places array",
      county: "Lvivska obl.",
      // imageId: "64007f7ef83a63307c4f472e",
      type: 5,
      // willCreateAt: nextDate
    }
  }));
  // console.log("incident will CreateAt , ", new Date(nextDate).toLocaleTimeString());
});

btnCreateReport.addEventListener("click", () => {
  sIncidents.send(JSON.stringify({
    id: 1,
    // method: EnumMethod.CREATE_REPORT,
    method: EnumMethod.GET_REPORTS,
    data: {
      // userId: CURRENT_USER_ID,
      // incidentId: CURRENT_INCIDENT_ID,
      // text: "some feedback text 2",
      query: "text 1"
    }
  }))
})
