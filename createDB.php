<?php
	include('dbconn.php');
	$db = new Database();
	$str = "DROP TABLE members";
	#$db->exec($str);
	$str = "CREATE TABLE members(
	member_id INT PRIMARY KEY,
	user_name TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL,
	password VARCHAR(50) NOT NULL)";
	$db->exec($str);
	$str = "INSERT INTO members(member_id,user_name,first_name,last_name,email,password) 
	VALUES (1,'dolavn','Dolav','Nitay','dolavn@post.bgu.ac.il','c129b324aee662b04eccf68babba85851346dff9')";
	$db->exec($str);
?>