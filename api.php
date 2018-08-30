<?php

session_start();		
		
include_once('php/config.php');
include_once('php/chat_realtime.php');
$chat = new Chat_realtime($name, $host, $username, $password, $imageDir);
		
$data = array();

if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST"){
	if(!empty($_POST['data'])){
		
		if($_POST['data'] == 'cek'){
			if(isset($_SESSION['user']) && isset($_SESSION['avatar'])){
				$data['status'] = 'success';
				$data['user'] 	= $_SESSION['user'];
				$data['avatar'] = $_SESSION['avatar'];
			}else{
				$data['status'] = 'error';
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
			if(isset($_SESSION['user']) && !empty($_POST['ke']) && !empty($_POST['date']) && !empty($_POST['avatar']) && !empty($_POST['tipe']) && isset($_POST['message']) && isset($_POST['images'])){
				$images = json_decode($_POST['images']);
				if(!empty($_POST['message']) && count($images) < 1){
					$data = $chat->send_message($_SESSION['user'], $_POST['ke'], $_POST['message'], "", $_POST['date'], $_POST['avatar'], $_POST['tipe']);
				}else if(!empty($_POST['message']) && count($images) > 0){
					$h = 0;
					foreach($images as $image){
						$n = $chat->arrayToBinaryString($image->binary);
						$chat->createImg($n, $image->name, 'image/png');
						if($h == 0){
							$data = $chat->send_message($_SESSION['user'], $_POST['ke'], $_POST['message'], $image->name, $_POST['date'], $_POST['avatar'], $_POST['tipe']);
						}else{	
							$data = $chat->send_message($_SESSION['user'], $_POST['ke'], "", $image->name, $_POST['date'], $_POST['avatar'], $_POST['tipe']);
						}
						$h++;
					}
				}else if(empty($_POST['message']) && count($images) > 0){
					foreach($images as $image){
						$n = $chat->arrayToBinaryString($image->binary);
						$chat->createImg($n, $image->name, 'image/png');
						$data = $chat->send_message($_SESSION['user'], $_POST['ke'], "", $image->name, $_POST['date'], $_POST['avatar'], $_POST['tipe']);
					}
				}
			}
		}else if($_POST['data'] == 'logout'){
			$data = $chat->user_logout($_SESSION['user']);
			if($data['status'] == 'success'){
				session_destroy();
			}
		}
	}
}else{
	$data["aa"] = "bb";
}
		
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
echo json_encode($data);
