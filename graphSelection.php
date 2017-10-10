<?php
	session_start();
	$str="";
	$scriptStr="<script>function loadGraphs(){";
	if(isset($_SESSION['member_id'])){
		include("dao.php");
		define('MAX_NUM_IN_ROW',5);
		$member_id = $_SESSION['member_id'];
		$graphs = new Graphs();
		$graphs->fetchAllByMember($member_id);
		$currNumInRow=0;
		$str=$str."<center><table><tr>";
		while($graph=$graphs->getNext()){
			$str=$str."<td><div class=\"drawCanvas\" onClick=\"parent.loadGraphToMainCanvas(".$graph->getId().")\" id=\"graph".$graph->getId()."\"></div>";
			$str=$str."<div class=\"gradient\">".$graph->getName()."<span class=\"deleteButton\" onClick=\"deleteGraph(".$graph->getId().")\">&times;</span></div>";
			$str=$str."</td>";
			$scriptStr=$scriptStr."drawNodesThumbnail(".$graph->getId().");\n";
			$currNumInRow++;
			if($currNumInRow==MAX_NUM_IN_ROW){
				$str=$str."</tr><tr>";
				$currNumInRow=0;
			}
			
		}
		$scriptStr=$scriptStr."}</script>";
		$str=$str."</tr></table>";
	}else{
		die("Unexpected error");
	}
?>
<meta charset="utf-8"/>
<html>
<head>
<script src="objects.js"></script>
<script src ="jsDraw2D.js"></script>
<script src="graphics.js"></script>
<script>
	function deleteGraph(graph_id){
			if(confirm('Are you sure you want to delete this graph? This cannot be undone.')){
					var url = "deleteGraph.php";
					var params = "graph_id=" + graph_id;
					var http = new XMLHttpRequest();
					currGraphId=graph_id;
					http.open("POST",url,true);
					http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					http.setRequestHeader("Content-length", params.length);
					http.setRequestHeader("Connection", "close");
					http.onreadystatechange = function() {//Call a function when the state changes.
						if(http.readyState == 4 && http.status == 200) {
							alert(http.responseText);
							if(http.responseText=="1"){ //"1" is the success code
								location.reload();
							}else{
								alert("A problem occured");
							}
						}
					}
					http.send(params);
			}
	}
</script>
<?php
	echo($scriptStr);
?>
<link rel="stylesheet" type="text/css" href="graphSelection.css">
</head>
<body onload="loadGraphs()">
<?php
	echo($str);
?>
</body>
</html>