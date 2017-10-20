<?php
	include('dbconn.php');
	$db = new Database();
	/*
	$str = "DROP TABLE edges";
	$db->exec($str);
	$str = "CREATE TABLE edges(
		first_node INT NOT NULL,
		second_node INT NOT NULL,
		weight INT NOT NULL,
		FOREIGN KEY (first_node) REFERENCES nodes(node_id),
		FOREIGN KEY (second_node) REFERENCES nodes(node_id)
		)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (8,7,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (9,8,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (10,8,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (10,9,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (10,11,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (11,7,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (14,15,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (12,15,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (13,12,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (15,13,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (16,19,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (16,20,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (17,18,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (19,17,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (21,23,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (22,21,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (23,24,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (24,25,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (27,26,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (27,29,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (28,27,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (29,28,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (30,26,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (30,28,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (32,31,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (32,33,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (32,34,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (32,36,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (32,38,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (34,40,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (35,36,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (36,39,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (36,40,1)";
	$db->exec($str);
	$str = "INSERT INTO edges(first_node,second_node,weight)
			VALUES (39,37,1)";
	$db->exec($str);
	//$str = "DROP TABLE graphs";
	//$db->exec($str);
	*/
	/*
	$str = "CREATE TABLE graphs(
		graph_id INT NOT NULL,
		graph_name TEXT NOT NULL,
		member_id INT NOT NULL,
		directed BIT NOT NULL,
		weighted BIT NOT NULL,
		PRIMARY KEY (graph_id),
		FOREIGN KEY (member_id) REFERENCES members(member_id)
		)";
	$db->exec($str);
	$str = "INSERT INTO graphs(graph_id,graph_name,member_id,directed,weighted)
			VALUES ('1','Test graph','1','0','0')";
	$db->exec($str);
	$str = "INSERT INTO graphs(graph_id,graph_name,member_id,directed,weighted)
			VALUES ('2','C3','1','0','0')";
	$db->exec($str);
	$str = "INSERT INTO graphs(graph_id,graph_name,member_id,directed,weighted)
			VALUES ('3','Tal graph','1','0','0')";
	$db->exec($str);
	$str = "INSERT INTO graphs(graph_id,graph_name,member_id,directed,weighted)
			VALUES ('4','my first graph','2','0','0')";
	$db->exec($str);
	$str = "INSERT INTO graphs(graph_id,graph_name,member_id,directed,weighted)
			VALUES ('5','BFS tester','1','0','0')";
	$db->exec($str);*/
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