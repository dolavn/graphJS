var nodes =[];
var x=20;
var y=20;
const NODE_RADIUS=20;

function addNode(){
	var node = new Node(x,y);
	node.setLocation(x,y);
	nodes.push(node);
	console.log(nodes.length);
	drawNodes();
}

function getNodes(){
	document.getElementById("animation").innerHTML = nodes[0].getX() + "," + nodes[0].getY();
}

function Node(x,y){
	this.neighbours = [];
	this.x = x;
	this.y = y;
	this.selected = false;
	this.collided = false;
}

function drawNodes(){
	var gr = new jsGraphics(document.getElementById("drawCanvas"));
	gr.clear();
	for(i=0;i<nodes.length;i=i+1){
		var x = nodes[i].getX();
		var y = nodes[i].getY();
		var color="black";
		if(nodes[i].selected){
			color = "blue";
		}
		createCircle(x,y,NODE_RADIUS,color);
	}
}

Node.prototype={
	constructor:Node,
	addNeighbour:function(node){
		this.neighbours.push(node);
	},
	setLocation:function(x,y){
		this.x = x;
		this.y = y;
		drawNodes();
	},
	getX:function(){
		return this.x;
	},
	getY:function(){
		return this.y;
	}
}

