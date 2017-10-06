<html>
<head></head>
<body>
<?php
	include('dbconn.php');
	$db = new Database();
	if($db){
		$results = $db->query('SELECT member_id,password FROM members');
		while($row=$db->getArray($results)){
			echo($row[0] . " " . $row[1]);
			echo("<br>");
		}
	}else{
		echo("cannot connect");
	}
?>
</body>
</html>