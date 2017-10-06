<?php
	include('dbconn.php');
	$db = new Database();
	#$str = "CREATE TABLE members(member_id INT PRIMARY KEY,user_name TEXT NOT NULL)";
	$str = "INSERT INTO members(member_id,user_name) VALUES (2,'Tal')";
	$db->exec($str);
?>