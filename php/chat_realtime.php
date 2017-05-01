<?php

/*****************************************************
* #### Chat Realtime (BETA) ####
* Coded by Ican Bachors 2016.
* http://ibacor.com/labs/chat-realtime
* Updates will be posted to this site.
* Aplikasi ini akan selalu bersetatus (BETA) 
* Karena akan terus di update & dikembangkan.
* Maka dari itu jangan lupa di fork & like ya sob :).
*****************************************************/

class Chat_realtime {
	
	private $name;
	private $host;
	private $username;
	private $password;
	
	function __construct($name, $host, $username, $password)
    {
        $this->dbh = new PDO('mysql:dbname='.$name.';host='.$host.";port=3306",$username, $password);
    }
	
	function user_login($user, $avatar){
		$name = htmlspecialchars($user);
		$data = array();
		$sql=$this->dbh->prepare("SELECT name FROM users WHERE name=?");
		$sql->execute(array($name));
		if($sql->rowCount() == 0){
			$upd=$this->dbh->prepare("INSERT INTO users (name,avatar,login,status) VALUES (?,?,NOW(),?)");
			$upd->execute(array($name, $avatar, 'online'));
		}else{
			$upd=$upd=$this->dbh->prepare("UPDATE users SET login=NOW(), status=? WHERE name=?");
			$upd->execute(array('online', $name));
		}
		$data['status'] = 'success';
		return $data;
	}
	
	function get_message($tipe, $ke, $user){
		$data = array();
		if($tipe == 'rooms'){
			if($ke == 'all'){
				$sql=$this->dbh->prepare("SELECT * FROM messages WHERE tipe=? order by date ASC");
				$sql->execute(array($tipe));
			}else{
				$sql=$this->dbh->prepare("SELECT * FROM messages WHERE ke=? order by date ASC");
				$sql->execute(array($ke));
			}
			while($r = $sql->fetch()){
				$data[] = array(
					'name' => $r['name'],
					'avatar' => $r['avatar'],
					'message' => $r['message'],
					'tipe' => $r['tipe'],
					'date' => $r['date'],
					'selektor' => $r['ke']
				);
			}
		}else if($tipe == 'users'){
			if($ke == 'all'){
				$sql=$this->dbh->prepare("SELECT * FROM messages WHERE (name = :id1 AND tipe= :id2) OR (ke = :id1 AND tipe = :id2) order by date ASC");
				$sql->execute(array(':id1' => $user, ':id2' => $tipe));
			}else{
				$sql=$this->dbh->prepare("SELECT * FROM messages WHERE (name = :id1 AND ke= :id2) OR (name = :id2 AND ke = :id1) order by date ASC");
				$sql->execute(array(':id1' => $user, ':id2' => $ke));
			}
			while($r = $sql->fetch()){
				$data[] = array(
					'name' => $r['name'],
					'avatar' => $r['avatar'],
					'message' => $r['message'],
					'tipe' => $r['tipe'],
					'date' => $r['date'],
					'selektor' => ($r['name'] == $user ? $r['ke'] : $r['name'])
				);
			}
		}
		return $data;
	}
	
	function get_user($user){
		if(isset($user)){
			$sqlm=$this->dbh->prepare("SELECT name FROM users WHERE name=?");
			$sqlm->execute(array($user));
			if($sqlm->rowCount() > 0){
				$upd=$this->dbh->prepare("UPDATE users SET login=NOW() WHERE name=?");
				$upd->execute(array($user));
			}
		}
		$data = array();
		$sql=$this->dbh->prepare("SELECT * FROM users");
		$sql->execute();
		while($r = $sql->fetch()){
			$data[] = array(
				'name' => $r['name'],
				'avatar' => $r['avatar'],
				'login' => $r['login'],
				'status' => $r['status']
			);
		}
		return $data;
	}
	
	function send_message($name, $ke, $message, $date, $avatar, $tipe){		
		$data = array();
		$sql=$this->dbh->prepare("INSERT INTO messages (name,ke,avatar,message,tipe,date) VALUES (?,?,?,?,?,?)");
		$sql->execute(array($name,$ke,$avatar,$message,$tipe,$date));
		$data['status'] = 'success';
		return $data;
	}
	
	function user_logout($name){
		$data = array();
		$user = $this->dbh->prepare("UPDATE users SET status=? WHERE name=?");
		$user->execute(array('offline',$name));
		$data['status'] = 'success';
		return $data;
	}
	
}
