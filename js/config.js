// MySQL API
var apis = 'api.php'; 

// Replace with: your firebase account
var config = {
    apiKey: "AIzaSyDfKpgAUCOja3z-tc0yHOqzOCEGo0seJAQ",
    databaseURL: "https://chatws-40480.firebaseio.com"
};
firebase.initializeApp(config);

// create firebase child
var dbRef = firebase.database().ref(),
	messageRef = dbRef.child('message'),
	userRef = dbRef.child('user');
