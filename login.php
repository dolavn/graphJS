<?php
	session_start();
	$redirect=false;
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
				echo("id:".$id);
				echo("can't login");
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
	if(isset($_SESSION['member_id'])){
		echo("already logged in!<br>");
		echo($_SESSION['member_id']);
	}else{
		include("dao.php");
		if(isset($_POST["user_name"]) && isset($_POST["password"])){
			$user_name = $_POST["user_name"];
			$password = $_POST["password"];
			$password = sha1($password);
			$members = new Members();
			$id=$members->login($user_name,$password);
			if($id!=-1){
				$_SESSION['member_id'] = $id;
			}else{
				echo("id:".$id);
				echo("can't login");
			}
		}else{
			echo("<p dir=\"ltr\" align=\"center\"><table style=\"width:100%\"><tr><td style=\"width:20%\">");
			echo("User name:</td><td style=\"width:80%\"><input type=\"text\" id=\"user_name\" name=\"user_name\" placeholder=\"Your user name...\"></td></tr>");
			echo("<tr><td style=\"width:20%\">Password:</td><td style=\"width:80%\"><input type=\"password\" id=\"password\" name=\"password\"></td></tr></table>");
			echo("<input type=\"submit\" value=\"Submit\">");
		}
	}
?>
</body>
</html>
