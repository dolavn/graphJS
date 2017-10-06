<html>
<head></head>
<body>
<?php
	$db = sqlite_open('data.db');
	if(!$db){
		echo("error");
	}else{
		echo("success");
	}
?>
</body>
</html>