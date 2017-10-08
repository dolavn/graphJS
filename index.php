<?php
	session_start();
?>
<meta charset="utf-8"/>
<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<script src="ui.js"></script>
<script src="dragAndDrop.js"></script>
<script src ="jsDraw2D.js"></script>
<script src="graphics.js"></script>
<script src="objects.js"></script>
<script src="algorithm.js"></script>
</head>
<body>
<div class="hider" id="hiderLogin" onClick="hideLogin()"></div>
<div class="popuptext" id="messagePopup"></div>
<div class="popuplogin" id="popupLogin"><iframe src="login.php" class="frame"></iframe></div>
<div class="sidenav" id="toolbar">
<button class="closebtn" onclick="closeNav()">Hide</button>
<?php
	include("dao.php");
	$str="";
	if(isset($_SESSION['member_id'])){
		$members = new Members();
		$member = $members->getMemberById($_SESSION['member_id']);
		$str = "Logged in as ".$member->getUserName();
		$str = $str." <button class=\"redButton\" onClick=\"disconnect()\">Disconnect</button><br>";
	}else{
		$str = "Not logged in.<button onClick=\"login()\" class=\"greenButton\">Log in</button>";
		$str = $str."<button onClick=\"register()\" class=\"greenButton\">Register</button>";
	}
	echo($str);
?>
<br>
<input type="button" onClick="addNode()" value="Add node">
<input type="button" onClick="getVertNum()" value="Get number of vertices">
<input type="button" onClick="getEdgeNum()" value="Get number of edges">
<input type="button" onClick="runDFS(nodes)" value="Run DFS">
<input type="button" onClick="transpose()" value="Create Transpose">
<input type="button" onClick="findSCC(nodes)" value="Find SCC"></div>
<div id="main">
<input type="button" onclick="openNav()" id="showToolBar" value="Show tool bar">
<table class="mainTable"><tr><td style="width:80%">
<div id="drawCanvas" oncontextmenu="rightClick(event)">
</div></td>
<td style="width:20%"><div id="nodesTable"></div></td></table>
</body>
</html>