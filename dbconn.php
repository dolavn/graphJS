<?php
	class Database{
		private $db;
		
		function __construct(){
			$this->db = sqlite_open('data.db');
			if(!$this->db){
				die("cannot connect");
			}
		}
		
		function query($str){
			$result = sqlite_query($str,$this->db);
			if(!$result){
				die("cannot execute");
			}
			return $result;
		}
		
		function getArray($res){
			if(!$res){
				die("result invalid");
			}
			$next =sqlite_fetch_array($res);
			return $next;
		}
		
		function exec($str){
			$result = sqlite_exec($str,$this->db);
			if(!$result){
				die("cannot execute");
			}else{
				echo("success");
			}
		}
	}
?>