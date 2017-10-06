<html>
<head></head>
<body>
<?php
	include('dbconn.php');
	$db = new Database();
	if($db){
		$results = $db->query('SELECT first_name FROM members');
		while($row = $results->fetchArray()){
			var_dump($row);
		}
	}else{
		echo("cannot connect");
	}
?>
</body>
</html>