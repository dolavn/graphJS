<?php
	class Member{
		private $id;
		private $user_name;
		private $first_name;
		private $last_name;
		private $email;
		private $password;
		
		function __construct($id,$user_name,$first_name,$last_name,$email,$password){
			$this->id = $id;
			$this->user_name = $user_name;
			$this->first_name = $first_name;
			$this->last_name = $last_name;
			$this->email = $email;
			$this->password = $password;
		}
		
		public function getId(){
			return $this->id;
		}
		
		public function getUserName(){
			return $this->user_name;
		}
		
		public function getFirstName(){
			return $this->first_name;
		}
		
		public function getLastName(){
			return $this->last_name;
		}
		
		public function getEmail(){
			return $this->email;
		}
		
		public function getPassword(){
			return $this->password;
		}
	}
	
	class Node{
			private $id;
			private $x;
			private $y;
			private $ind;
			private $graphId;
			private $neighbours;
			
			function __construct($id,$x,$y,$ind,$graphId,$neighbours){
				$this->id = $id;
				$this->x = $x;
				$this->y = $y;
				$this->ind = $ind;
				$this->graphId = $graphId;
				$this->neighbours = $neighbours;
			}
			
			public function getId(){
				return $this->id;
			}
			
			public function getX(){
				return $this->x;
			}
			
			public function getY(){
				return $this->y;
			}
			
			public function getInd(){
				return $this->ind;
			}
			
			public function getGraphId(){
				return $this->graphId;
			}
			
			public function getNeighbours(){
				return $this->neighbours;
			}
	}
	
	class Edge{
		private $node1;
		private $node2;
		private $weight;
		
		
		function __construct($node1,$node2,$weight){
			$this->node1 = $node1;
			$this->node2 = $node2;
			$this->weight = $weight;
		}
		
		function getNode1(){
			return $this->node1;
		}
		
		function getNode2(){
			return $this->node2;
		}
		
		function getWeight(){
			return $this->weight;
		}
		
		function setNode1($node1){
			$this->node1 = $node1;
		}
		
		function setNode2($node2){
			$this->node2 = $node2;
		}
	}
	
	class Graph{
		private $id;
		private $name;
		private $member_id;
		private $directed;
		private $weighted;
		private $nodes;
		
		function __construct($id,$name,$member_id,$nodes,$directed,$weighted){
			$this->id = $id;
			$this->name = $name;
			$this->member_id = $member_id;
			$this->nodes = $nodes;
			$this->directed = $directed;
			$this->weighted = $weighted;
		}
		
		public function getId(){
			return $this->id;
		}
		
		public function getName(){
			return $this->name;
		}
		
		public function getMemberId(){
			return $this->member_id;
		}
		
		public function getNodes(){
			return $this->nodes;
		}
		
		public function getDirected(){
			return $this->directed;
		}
		
		public function getWeighted(){
			return $this->weighted;
		}
	}
		
?>