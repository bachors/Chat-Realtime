// Replace with: your_firebase_name.firebaseio.com
var dbRef = new Firebase("https://REPLACE.firebaseio.com/"),
	apis = 'api.php'; // MySQL API
	
// create firebase child
var messageRef = dbRef.child('message'),
	userRef = dbRef.child('user');