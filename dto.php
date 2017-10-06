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
			$this->email = $mail;
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
?>