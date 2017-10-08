<?php
	session_start();
	$redirect=false;
	$failedLogin=false;
	if(isset($_SESSION['member_id'])){
		echo("already logged in!<br>");
		echo($_SESSION['member_id']);
	}else{
		if(isset($_POST["user_name"]) && isset($_POST["password"])){
			include("dao.php");
			$user_name = $_POST["user_name"];
			$password = $_POST["password"];
			$password = sha1($password);
			$members = new Members();
			$id=$members->login($user_name,$password);
			if($id!=-1){
				$_SESSION['member_id'] = $id;
				$redirect=true;
			}else{
				$failedLogin = true;
			}
		}else{
			$drawForm=true;
		}
	}
	if($redirect){
		echo("<script>window.top.location.href =\"index.php\"</script>");
	}
?>
<meta charset="utf-8"/>
<html>
<head>
<link rel="stylesheet" type="text/css" href="register.css">
</head>
<body>
<form method="post" action="login.php">
<?php
	if($failedLogin){
		echo("<div class=\"errorText\">User name or password incorrect</div><br>");
	}
	echo("<p dir=\"ltr\" align=\"center\">");
	echo("<table style=\"width:100%\"><tr><td style=\"width:30%\">");
	echo("User name:</td><td style=\"width:70%\"><input type=\"text\" id=\"user_name\" name=\"user_name\" placeholder=\"Your user name...\"></td></tr>");
	echo("<tr><td style=\"width:30%\">Password:</td><td style=\"width:70%\"><input type=\"password\" id=\"password\" name=\"password\"></td></tr></table>");
	echo("<input type=\"submit\" value=\"Submit\">");
?>
</body>
</html>
