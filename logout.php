<?php
	session_start();
	if(isset($_SESSION['member_id'])){
		unset($_SESSION['member_id']);
		header("Location: index.php");
	}else{
		echo("A problem was encountered");
	}
?>