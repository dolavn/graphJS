<html>
<head></head>
<body>
<?php
	$db = new SQLite3('db/db.db');
	
	$db->query('CREATE TABLE members(member_id INTEGER PRIMARY KEY,name TEXT NOT NULL, mail TEXT NOT NULL)');
	$db->query('CREATE TABLE graphs(id INTEGER PRIMARY KEY,name TEXT NOT NULL,member_id INT NOT NULL, FOREIGN KEY(member_id) REFERENCES members(id))';
	$db->query('CREATE TABLE nodes(id INTEGER PRIMARY KEY,x INTEGER NOT NULL,y INTEGER NOT NULL)');
	
?>
</body>
</html>