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
	if(!isset($_SESSION['member_id'])){ //In case member id isn't set.
		$str = "unsuccess session";
	}else{
		$member_id = $_SESSION['member_id'];
		include("dao.php");
		if(isset($_POST['graph_name'])){ //Checks if post data was received.
			$newGraph=false; 
			$name = $_POST['graph_name'];
			$graphs = new Graphs();
			$graph_id = $_POST['graph_id'];
			$directed = $_POST['directed'];
			$weighted = $_POST['weighted'];
			if($graph_id==-1){ //This is a new graph
				$newGraph = true;
				$graph_id = $graphs->getNextId();
				$graph = new Graph($graph_id,$name,$member_id,0,$directed,$weighted);
				$graphs->addGraph($graph); //Adds the graph to the database.
			}else{
				$graphs->setGraphName($graph_id,$name); //Not a new graph. Updates it's name only.
			}
			/* Node handling. */
			$nodes = new Nodes();
			$edges = new Edges();
			if(!$newGraph){ //Creates an array of all the existing nodes, to delete existing ones in case they were deleted.
				$nodes->fetchAllFromGraph($graph_id);
				$existingNodes=array();
				while($currNode=$nodes->getNext()){
					array_push($existingNodes,$currNode->getId());
				}
			}
			$nodesStr = $_POST['nodes']; //Get node data.
			if($nodesStr!=""){ //New nodes were added.
				/*
				Decodes node data.
				*/
				$nodesStrArr = explode('$',$nodesStr); //An array of each node's data.
				$existingEdges = array(); //All existing edges.
				$indexesShift = array(); //A map between indexes in the nodes array, to node index in the database.
				for($i=0;$i<count($nodesStrArr);$i++){ //Goes over all the nodes.
					$currNodeStr = $nodesStrArr[$i];
					/*Decodes node's data. */
					$currArr = explode('@',$currNodeStr);
					$id = $currArr[0];
					$ind = $currArr[1];
					$x = $currArr[2];
					$y = $currArr[3];
					$newNode=false;
					for($j=4;$j<count($currArr);$j++){ //Goes over all the node's neighbours.
						$edgeStr = explode('|',$currArr[$j]);
						$currEdge = new Edge($i,$edgeStr[0],$edgeStr[1]);
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
				if(!$newGraph){
					foreach($existingNodes as $node_id){
						if(isset($node_id)){
							$nodes->deleteNode($node_id);
						}
					}
				}
			}
		}
		
	}
	echo json_encode($str); //Outputs answer string.
?>