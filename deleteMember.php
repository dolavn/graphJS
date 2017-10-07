<html>
<head></head>
<body>
<?php
	include("dao.php");
	if(isset($_POST["member_id"])){
		$members = new Members();
		$members->deleteMember($_POST["member_id"]);
	}
?>
<form method="post" action="deleteMember.php">
<input type="text" name="member_id">
<br>
<input type="submit" value="submit">
</form>
</body>
</html>