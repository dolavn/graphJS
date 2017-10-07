<?php
	include('dbconn.php');
	$db = new Database();
	/*$str = "DROP TABLE members";
	$db->exec($str);
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
	$db->exec($str);*/
	/*
	$str = "DROP TABLE edges";
	$db->exec($str);
	$str = "DROP TABLE nodes";
	$db->exec($str);
	$str = "DROP TABLE graphs";
	$db->exec($str);*/

	/*
	$str = "CREATE TABLE graphs(
		graph_id INT NOT NULL,
		graph_name TEXT NOT NULL,
		member_id INT NOT NULL,
		PRIMARY KEY (graph_id),
		FOREIGN KEY (member_id) REFERENCES members(member_id)
		)";
	$db->exec($str);
	$str = "CREATE TABLE nodes(
		node_id INT NOT NULL,
		x INT NOT NULL,
		y INT NOT NULL,
		ind INT NOT NULL,
		graph_id INT NOT NULL,
		PRIMARY KEY (node_id),
		FOREIGN KEY (graph_id) REFERENCES graphs(graph_id)
	)";
	$db->exec($str);
	$str = "CREATE TABLE edges(
		first_node INT NOT NULL,
		second_node INT NOT NULL,
		FOREIGN KEY (first_node) REFERENCES nodes(node_id),
		FOREIGN KEY (second_node) REFERENCES nodes(node_id)
		)";
	$db->exec($str);*/
	/*
	$str = "INSERT INTO graphs(graph_id,graph_name,member_id)
			VALUES(1,'Test graph',1)";
	$db->exec($str);
	
	$str = "INSERT INTO nodes(node_id,x,y,ind,graph_id)
			VALUES(1,20,20,0,1)";
	$db->exec($str);
	$str = "INSERT INTO nodes(node_id,x,y,ind,graph_id)
			VALUES(2,100,80,1,1)";
	$db->exec($str);
	
	$str = "INSERT INTO edges(first_node,second_node)
			VALUES(1,2)";
	$db->exec($str);*/
	
?>