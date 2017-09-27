var nodes =[];

function addNode(x,y){
	var node = new Node(x,y);
	node.setLocation(x,y);
	nodes.push(node);
}

function getNodes(){
	document.getElementById("animation").innerHTML = nodes[0].getX() + "," + nodes[0].getY();
}

function Node(x,y){
	createCircle(x,y,20)
	this.neighbours = [];
	this.x = x;
	this.y = y;
	
}

Node.prototype={
	constructor:Node,
	addNeighbour:function(node){
		this.neighbours.push(node);
	},
	setLocation:function(x,y){
		var gr = new jsGraphics(document.getElementById("drawCanvas"));
		gr.clear();
		this.x = x;
		this.y = y;
		createCircle(this.x,this.y,20);
	},
	getX:function(){
		return this.x;
	},
	getY:function(){
		return this.y;
	}
}

