<?php
	session_start();
	if(!isset($_SESSION['member_id'])){ //In case member id isn't set.
		$str = "unsuccess session";
	}else{
		include("dao.php");
		$member_id = $_SESSION['member_id'];
		$graphs = new Graphs();
		if(!isset($_POST['graph_id'])){
			$str = "unexpected problem";
		}else{
			$id = $_POST['graph_id'];
			$graph = $graphs->getGraphById($id);
			if($graph->getMemberId()==$member_id){
				$graphs->deleteGraph($id);
				$str = 1;
			}else{
				$str = "You are not authorized to do this.";
			}
		}
	}
	echo json_encode($str);
?>