<?php
	session_start();
	if(!isset($_SESSION['member_id'])){
		$str = "unsuccess session";
	}else{
		include("dao.php");
		$member_id = $_SESSION['member_id'];
		$graphs = new Graphs();
		$str;
		if(isset($_POST['graph_id'])){			
			$graph = $graphs->getGraphById($_POST['graph_id']);
			if($member_id==$graph->getMemberId()){
				$str = $graph->getName()."$";
				foreach($graph->getNodes() as $node){
					$x = $node->getX();
					$y = $node->getY();
					$ind = $node->getInd();
					$neighbours = $node->getNeighbours();
					$str = $str.$ind."?".$x."?".$y."?";
					if(count($neighbours)==0){
						$str = $str."-1";
					}
					foreach($neighbours as $neighbour){
						$str = $str.$neighbour."?";
					}
					$str = rtrim($str,'?');
					$str = $str."$";
				}
				$str = rtrim($str,'$');
			}else{
				$str = "unsuccess member";
			}
		}else{
			$str = "unsuccess various";
		}
		echo json_encode($str);
	}
?>