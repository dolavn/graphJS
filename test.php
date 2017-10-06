<html>
<head></head>
<body>
<?php
	class MyDB extends SQLite3 {
		function __construct(){
			$this->open('data.db');
		}
	}
	$db = new MyDB();
	if(!$db){
		echo $db->lastErrorMsg();
	}else{
		echo "Database opened successfully\n";
	}
?>
</body>
</html>