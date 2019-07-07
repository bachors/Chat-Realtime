// Domain
const domain = "http://REPLACE";

// MySQL API
const apis = 'api.php';

// set image directori
const imageDir = 'image';

// Replace with: your firebase account
const config = {
    apiKey: "REPLACE",
    databaseURL: "https://REPLACE.firebaseio.com"
};
firebase.initializeApp(config);

// create firebase child
const dbRef = firebase.database().ref();

const messageRef = dbRef.child('message');
const userRef = dbRef.child('user');
