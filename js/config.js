// Domain
const domain = "http://localhost/Chat-Realtime/";

// MySQL API
const apis = 'api.php';

// set image directori
const imageDir = 'image';

// Replace with: your firebase account
const config = {
    apiKey: "AIzaSyDfKpgAUCOja3z-tc0yHOqzOCEGo0seJAQ",
    databaseURL: "https://chatws-40480.firebaseio.com"
};
firebase.initializeApp(config);

// create firebase child
const dbRef = firebase.database().ref();

const messageRef = dbRef.child('message');
const userRef = dbRef.child('user');
