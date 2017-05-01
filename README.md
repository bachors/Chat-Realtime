# Chat-Realtime

Aplikasi ini akan selalu bersetatus (BETA) Karena akan terus di update & dikembangkan. Maka dari itu jangan lupa di fork & like ya sob :).

Aplikasi ini dibuat menggunakan:
- PHP
- MySQL PDO
- Bootstrap
- jQuery
- Firebase
- Fontawesome
- <a href="https://github.com/OneSignal/emoji-picker">Emoji-picker</a>

Fitur:
- Public rooms chat.
- Private chat with user.
- Sedn message with emoticon.

Realtime:
- Status user online or offline.
- Push new user login.
- Push new message.
- Push inbox count.

<h3>Penggunaan:</h3>
1. Import database <code>db/chat_realtime.sql</code>

2. Setting database <code>php/config.php</code>
<pre>
&lt;?php
// Replace with: your database account
$username     = "REPLACE";
$password     = "REPLACE";
$host         = "REPLACE";
$name         = "chat_realtime";
</pre>
3. Setting firebase & MySQL API <code>js/config.js</code>
<pre>
// MySQL API
var apis = 'api.php'; 

// Replace with: your firebase account
var config = {
    apiKey: "REPLACE",
    databaseURL: "https://REPLACE.firebaseio.com"
};
firebase.initializeApp(config);

// create firebase child
var dbRef = firebase.database().ref(),
	messageRef = dbRef.child('message'),
	userRef = dbRef.child('user');
</pre>

<h3>Done :)</h3>
