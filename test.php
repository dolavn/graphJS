<html>
<head></head>
<body>
<?php
	/*class MyDB extends SQLite3
	{
		function __construct(){
			$this->open('data.db');
		}
	}*/
	$dir = 'sqlite:data.db';
	$dbh = new PDO($dir) or die("cannot open");
	
	if(!$dbh){
		echo("error");
	}else{
		echo("success");
	}
?>
</body>
</html>