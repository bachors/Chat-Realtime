<?php

session_start();		
		
include_once('php/config.php');
include_once('php/chat_realtime.php');
$chat = new Chat_realtime($name, $host, $username, $password);
		
$data = array();

if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST"){
	if(!empty($_POST['data'])){
		
		if($_POST['data'] == 'cek'){
			if(isset($_SESSION['user']) && isset($_SESSION['avatar'])){
				$data['status'] = 'success';
				$data['user'] 	= $_SESSION['user'];
				$data['avatar'] = $_SESSION['avatar'];
			}else{
				$data['status'] == 'error';
			}
		}else if($_POST['data'] == 'login'){
			if(!empty($_POST['name']) && !empty($_POST['avatar'])){
				$data = $chat->user_login($_POST['name'], $_POST['avatar']);
				if($data['status'] == 'success'){
					$_SESSION['user'] = $_POST['name'];
					$_SESSION['avatar'] = $_POST['avatar'];
				}
			}
		}else if($_POST['data'] == 'message'){
			if(!empty($_POST['ke']) && !empty($_POST['tipe'])){
				$data = $chat->get_message($_POST['tipe'], $_POST['ke'], $_SESSION['user']);
			}			
		}else if($_POST['data'] == 'user'){
			$data = $chat->get_user($_SESSION['user']);
		}else if($_POST['data'] == 'send'){
			if(isset($_SESSION['user']) && !empty($_POST['ke']) && !empty($_POST['message']) && !empty($_POST['date']) && !empty($_POST['avatar']) && !empty($_POST['tipe'])){
				$data = $chat->send_message($_SESSION['user'], $_POST['ke'], $_POST['message'], $_POST['date'], $_POST['avatar'], $_POST['tipe']);
			}
		}else if($_POST['data'] == 'logout'){
			$data = $chat->user_logout($_SESSION['user']);
			if($data['status'] == 'success'){
				session_destroy();
			}
		}
	}
}
		
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
echo json_encode($data, JSON_PRETTY_PRINT);
