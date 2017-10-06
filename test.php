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
	$db = sqlite_open("data.db");
	
	if(!$db){
		echo("error");
	}else{
		echo("success");
	}
?>
</body>
</html>