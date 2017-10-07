<html>
<head></head>
<body>
<?php
	include('dao.php');
	$members = new Members();
	$members->fetchAll();
	echo("<table border=1><tr><td>Id</td><td>User name</td><td>First name</td><td>Last name</td><td>Email</td><td>Password</td></tr>");
	while($member = $members->getNext()){
		echo("<tr>");
		echo("<td>".$member->getId()."</td><td>".$member->getUserName()."</td><td>".$member->getFirstName());
		echo("</td><td>".$member->getLastName()."</td><td>".$member->getEmail()."</td><td>".$member->getPassword()."</td></tr>");
	}
	echo("</table>");
	$nodes = new Nodes();
	echo("<br><br>");
	echo("<table border=1><tr><td>Id</td><td>X</td><td>Y</td><td>Index</td><td>Graph id</td><td>Neighbours</td></tr>");
	$nodes->fetchAllFromGraph(1);
	while($node = $nodes->getNext()){
		echo("<tr>");
		echo("<td>".$node->getId()."</td><td>".$node->getX()."</td><td>".$node->getY()."</td><td>".$node->getInd());
		echo("</td><td>".$node->getGraphId()."</td><td>");
		print_r($node->getNeighbours());
	}
	echo("</table><br><br>");
	$graphs = new Graphs();
	echo("<table border=1><tr><td>Id</td><td>Name</td><td>Member id</td><td>Nodes</td></tr>");
	$graphs->fetchAllByMember(1);
	while($graph = $graphs->getNext()){
		echo("<tr>");
		echo("<td>".$graph->getId()."</td><td>".$graph->getName()."</td><td>".$graph->getMemberId());
		echo("</td><td>");
		foreach($graph->getNodes() as $node){
			echo($node->getId()." ");
		}
	}
?>
</body>
</html>