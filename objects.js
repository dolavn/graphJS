var nodes =[]; //The list of the nodes
var lastX=20; //The last x coordinate of the node selected before selection
var lastY=20; //The last y coordinate of the node selected before selection
const NODE_RADIUS=20; //The radius of the node

/**
	Adds a new node to the node list.
*/
function addNode(){
	lastX = 20;
	lastY = 20;	
	var node = new Node(lastX,lastY);
	node.setLocation(lastX,lastY);
	nodes.push(node);
	console.log(nodes.length);
	drawNodes();
}

/**
	Prints the number of vertices to the screen
*/
function getVertNum(){
	var string = "<font size=5>Number of vertices:" + nodes.length + "<br><button onClick=\"clearMessages(-1)\">Ok</button>";
	document.getElementById("messages").innerHTML = string;
}

/**
	Prints the number of edges to the screen
*/
function getEdgeNum(){
}

/**
	Constructs a new Node object
	
	@param x The x coordinate of the node.
	@param y The y coordinate of the node
*/
function Node(x,y){
	this.neighbours = [];
	this.x = x;
	this.y = y;
	this.selected = false;
	this.collided = false;
}

/**
	Draws all the nodes to the screen
*/
function drawNodes(){
	clearCanvas();
	for(i=0;i<nodes.length;i=i+1){
		var x = nodes[i].getX();
		var y = nodes[i].getY();
		var color="black";
		if(nodes[i].selected){
			color = "blue";
		}
		for(j=0;j<nodes[i].neighbours.length;j=j+1){
			var other = nodes[i].neighbours[j];
			drawArrow(x,y,other.getX(),other.getY());
		}
		createCircle(x,y,NODE_RADIUS,color);
	}
}

/**
	Clears the messages from the screen,
	and returns the node to it's original position, if one is selected.
	
	@param ind The index of the selected node, or -1 otherwise
*/
function clearMessages(ind){
	if(ind!=-1){
		var node = nodes[ind];
		node.setLocation(lastX,lastY);
	}
	document.getElementById("messages").innerHTML="";
}

function createEdge(ind1,ind2){
	var node1 = nodes[ind1];
	var node2 = nodes[ind2];
	node1.addNeighbour(node2);
	node2.addNeighbour(node1);
	clearMessages(ind1);
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

