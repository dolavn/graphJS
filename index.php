<?php
	session_start();
?>
<meta charset="utf-8"/>
<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<script src="jquery.js"></script>
<script src="ui.js"></script>
<script src="dragAndDrop.js"></script>
<script src ="jsDraw2D.js"></script>
<script src="graphics.js"></script>
<script src="objects.js"></script>
<script src="algorithm.js"></script>
</head>
<body onLoad="setUpUI()">
<div class="hider" id="hiderLogin" onClick="hideLogin()"></div>
<div class="hider" id="hiderLoadGraph" onClick="hideLoadGraph()"></div>
<div class="hider" id="hiderName" onClick="hideGraphName()"></div>
<div class="commentsModal" id="comments">
<div class="commentsModalText" id="commentsBody">
<p id="titleComment"></p>
<p id="textComment"></p>
</div>
<div class="gradient"></div>
</div>
<div class="popuptext" id="messagePopup"></div>
<div class="popupLarge" id="popupName"><span class="closebtn" onClick="hideGraphName()">&times;</span><br>Enter graph name:
<input type="text" id="graphNameTxt" placeHolder="Your graph's name..."><br><br>
<input type="button" onClick="changeGraphName()" value="Set name">
</div>
<div class="popupLarge" id="popupLogin"><span class="closebtn" onClick="hideLogin()">&times;</span><iframe src="login.php" class="frame"></iframe></div>
<div class="popupLarge" id="popupGraph"><span class="closebtn" onClick="hideLoadGraph()">&times;</span><iframe src="graphSelection.php" class="frame"></iframe></div>
<div class="sidenav" id="toolbar">
<button class="hidebtn" onclick="closeNav()">Hide</button>
<?php
	include("dao.php");
	$str="";
	if(isset($_SESSION['member_id'])){
		$members = new Members();
		$graphs = new Graphs();
		$member = $members->getMemberById($_SESSION['member_id']);
		$str = "Logged in as ".$member->getUserName();
		$str = $str." <button class=\"redButton\" onClick=\"disconnect()\">Disconnect</button><br>";
		$str = $str."<div class=\"seperator\"></div>";
		$str = $str."<div id=\"currentGraph\" onClick=\"openNamePopup()\"></div>";
		$str = $str." <button class=\"greenButton\" onClick=\"saveGraph()\"  id=\"saveButton\" disabled>Save graph</button><br>";
		$str = $str."<div class=\"seperator\"></div>";
		$str = $str." <span onClick=\"openLoadGraph()\">Load an existing graph</span><br>";
	}else{
		$str = "Not logged in.<button onClick=\"login()\" class=\"greenButton\">Log in</button>";
		$str = $str."<button onClick=\"register()\" class=\"greenButton\">Register</button>";
	}
	echo($str);
?>
<div class="seperator"></div>
<input type="button" onClick="addNode()" value="Add node">
<input type="button" onClick="getVertNum()" value="Get number of vertices">
<input type="button" onClick="getEdgeNum()" value="Get number of edges">
<input type="button" onClick="runDFS(nodes)" value="Run DFS">
<input type="button" onClick="transpose()" value="Create Transpose">
<input type="button" onClick="findSCC(nodes)" value="Find SCC">
<div class="seperator"></div>
<div id="messages"></div>
<div class="seperator"></div>
</div>
<div id="main">
<input type="button" onclick="openNav()" id="showToolBar" value="Show tool bar">
<table class="mainTable"><tr><td style="width:80%">
<div id="drawCanvas" oncontextmenu="rightClick(event)">
</div></td>
<td style="width:20%"><div id="nodesTable"></div></td></table>
</body>
</html>