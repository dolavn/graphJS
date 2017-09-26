var nodes =[];

function addNode(){
	var node = new Node();
	node.setLocation(50,50);
	nodes.push(node);
	createCircle(50,50,20)
}

function getNodes(){
	document.getElementById("animation").innerHTML = nodes[0].getX() + "," + nodes[0].getY();
}

function Node(){
	this.neighbours = [];
	this.x = 0;
	this.y = 0;
}

Node.prototype={
	constructor:Node,
	addNeighbour:function(node){
		this.neighbours.push(node);
	},
	setLocation:function(x,y){
		this.x = x;
		this.y = y;
	},
	getX:function(){
		return this.x;
	},
	getY:function(){
		return this.y;
	}
}

