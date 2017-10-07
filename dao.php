<?php
	include('dbconn.php');
	include('dto.php');
	
	class Members{
		private $db;
		private $rows;
		
		function __construct(){
			$this->db = new Database();
		}
		
		function fetchAll(){
			$str = "SELECT member_id,user_name,first_name,last_name,email,password FROM members";
			$this->rows = $this->db->query($str);
		}
		
		function deleteMember($member_id){
			$str = "DELETE FROM members WHERE member_id='".$member_id."'";
			$this->db->exec($str);
		}
		
		function getNextId(){
			#$str = "DELETE FROM members WHERE member_id=2";
			#$this->db->exec($str);
			$str = "SELECT MAX(member_id) FROM members";
			$this->rows = $this->db->query($str);
			$curr = $this->db->getArray($this->rows);
			$this->rows = false;
			return $curr[0]+1;
		}
		
		function addMember($member){
			$id = $member->getId();
			$user_name = $member->getUserName();
			$first_name = $member->getFirstName();
			$last_name = $member->getLastName();
			$email = $member->getEmail();
			$password = $member->getPassword();
			$str = "INSERT INTO members(member_id,user_name,first_name,last_name,email,password)
					VALUES (".$id.",'".$user_name."','".$first_name."','".$last_name."','".$email."','".$password."')";
			$this->db->exec($str);
		}
		
		function getNext(){
			if(!$this->rows){
				throw new Exception("Couldn't run query");
			}
			$curr = $this->db->getArray($this->rows);
			if(!$curr){
				return false;
			}else{
				$id = $curr[0];
				$user_name = $curr[1];
				$first_name = $curr[2];
				$last_name = $curr[3];
				$email = $curr[4];
				$password = $curr[5];
				return new Member($id,$user_name,$first_name,$last_name,$email,$password);
			}
		}
		
	}
	
	class Nodes{
		private $db;
		private $rows;
		
		function __construct(){
			$this->db = new Database();
		}
		
		function fetchAllFromGraph($graph_id){
			$str = "SELECT node_id,x,y,ind,graph_id FROM nodes WHERE graph_id=".$graph_id;
			$this->rows = $this->db->query($str);
		}
		
		function getNext(){
			if(!$this->rows){
				throw new Exception("Couldn't run query");
			}
			$curr = $this->db->getArray($this->rows);
			if(!$curr){
				return false;
			}else{
				$id = $curr[0];
				$x = $curr[1];
				$y = $curr[2];
				$ind = $curr[3];
				$graph_id = $curr[4];
				$neighbours = $this->getNeighbours($id);
				return new Node($id,$x,$y,$ind,$graph_id,$neighbours);
			}
		}
		
		function getNeighbours($node_id){
			$str = "SELECT second_node FROM edges WHERE first_node=".$node_id;
			$rowsEdges = $this->db->query($str);
			$ans = array();
			while($curr = $this->db->getArray($rowsEdges)){
				$currIndex = $curr[0];
				array_push($ans,$currIndex);
			}
			return $ans;
		}
	}
	
	class Graphs{
		
		private $db;
		private $rows;
		private $nodes;
		
		function __construct(){
			$this->db = new Database();
			$this->nodes = new Nodes();
		}
		
		function fetchAllByMember($member_id){
			$str = "SELECT graph_id,graph_name,member_id FROM graphs WHERE member_id=".$member_id;
			$this->rows = $this->db->query($str);
		}
		
		function getNext(){
			if(!$this->rows){
				throw new Exception("Couldn't run query");
			}
			$curr = $this->db->getArray($this->rows);
			if(!$curr){
				return false;
			}else{
				$id = $curr[0];
				$name = $curr[1];
				$member_id = $curr[2];
				$nodes = array();
				$this->nodes->fetchAllFromGraph($id);
				while($node = $this->nodes->getNext()){
					array_push($nodes,$node);
				}
				return new Graph($id,$name,$member_id,$nodes);
			}
		}
	}
?>