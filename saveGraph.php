<?php
	session_start();
	
	function findIndex($node_id,$array){
		for($i=0;$i<count($array);$i++){
			if($node_id==$array[$i]){
				return $i;
			}
		}
		return -1;
	}
	
	$str ="";
	if(!isset($_SESSION['member_id'])){
		$str = "unsuccess session";
	}else{
		$member_id = $_SESSION['member_id'];
		include("dao.php");
		if(isset($_POST['graph_name'])){
			$name = $_POST['graph_name'];
			$graphs = new Graphs();
			$graph_id = $_POST['graph_id'];
			if($graph_id==-1){
				$graph_id = $graphs->getNextId();
				$graph = new Graph($graph_id,$name,$member_id,0);
				$graphs->addGraph($graph);
			}else{
				$graphs->setGraphName($graph_id,$name);
			}
			$nodes = new Nodes();
			$edges = new Edges();
			$nodes->fetchAllFromGraph($graph_id);
			$existingNodes=array();
			while($currNode=$nodes->getNext()){
				array_push($existingNodes,$currNode->getId());
			}
			$nodesStr = $_POST['nodes'];
			$nodesStrArr = explode('$',$nodesStr);
			$existingEdges = array();
			$indexesShift = array();
			for($i=0;$i<count($nodesStrArr);$i++){
				$currNodeStr = $nodesStrArr[$i];
				$currArr = explode('@',$currNodeStr);
				$id = $currArr[0];
				$ind = $currArr[1];
				$x = $currArr[2];
				$y = $currArr[3];
				$newNode=false;
				for($j=4;$j<count($currArr);$j++){
					$currEdge = new Edge($i,$currArr[$j]);
					array_push($existingEdges,$currEdge);
				}
				if($id==-1){
					$newNode=true;
					$id = $nodes->getNextId();
				}
				$currNode = new Node($id,$x,$y,$ind,$graph_id,0);
				if($newNode){
					$nodes->addNode($currNode);
				}else{
					$edges->deleteEdgesFromNode($id);
					$nodes->updateNode($currNode);
					$arrayInd = findIndex($id,$existingNodes);
					array_splice($existingNodes,$arrayInd,1);
				}
				array_push($indexesShift,$id);
			}
			/*Shifting values in edges array and adding them*/
			for($i=0;$i<count($existingEdges);$i++){
				$edge = &$existingEdges[$i];
				$node1 = $edge->getNode1();
				$node2 = $edge->getNode2();
				$node1 = $indexesShift[$node1];
				$node2 = $indexesShift[$node2];	
				$edge->setNode1($node1);
				$edge->setNode2($node2);
				$edges->addEdge($edge);
			}
			/*Deleting remaining nodes*/
			foreach($existingNodes as $node_id){
				if(isset($node_id)){
					$nodes->deleteNode($node_id);
				}
			}
		}
		
	}
	echo json_encode($str);
?>