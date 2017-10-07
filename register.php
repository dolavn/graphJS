<meta charset="utf-8"/>
<html>
<head>
<link rel="stylesheet" type="text/css" href="register.css">
</head>
<body><center>
<?php
	include("dao.php");
	$user_name="";
	$first_name="";
	$last_name="";
	$email="";
	$password="";
	if(isset($_POST["user_name"])){
		$user_name = $_POST["user_name"];
	}else{
		die("Unexpected problem1");
	}
	if(isset($_POST["first_name"])){
		$first_name = $_POST["first_name"];
	}else{
		die("Unexpected problem2");
	}
	if(isset($_POST["last_name"])){
		$last_name = $_POST["last_name"];
	}else{
		die("Unexpected problem3");
	}
	if(isset($_POST["email"])){
		$email = $_POST["email"];
	}else{
		die("Unexpected problem4");
	}
	if(isset($_POST["password"])){
		$password = $_POST["password"];
	}else{
		die("Unexpected problem5");
	}
	$password = sha1($password);
	$members = new Members();
	$id = $members->getNextId();
	$member = new Member($id,$user_name,$first_name,$last_name,$email,$password);
	$members->addMember($member);
	
	echo("Success!");
?>
</center>
</body>
</html>