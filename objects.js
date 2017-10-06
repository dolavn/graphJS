var nodes =[]; //The list of the nodes
var nodeCount=0;
var lastX=20; //The last x coordinate of the node selected before selection
var lastY=20; //The last y coordinate of the node selected before selection
var showDFSOutput=false; //If true, discovery time and finish time will be shown for each node
const NODE_RADIUS=25; //The radius of the node
const MAX_WIDTH=800;
const MAX_HEIGHT=500;

/**
	Adds a new node to the node list.
*/
function addNode(){
	var x = Math.random()*MAX_WIDTH; //Random x coordinate
	var y = Math.random()*MAX_HEIGHT; //Random y coordinate
	lastX = x; //Changes the last x to be the x of the new node
	lastY = y; //Changes the last y to be the y of the new node
	var node = new Node(lastX,lastY,nodeCount); //Creates the node
	nodeCount = nodeCount + 1;
	node.setLocation(lastX,lastY); //Sets the node's location
	nodes.push(node); //Adds the node to the nodes list
	drawNodes(); //Draws the node
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
	var edges=0;
	var i;
	//Counts all the edges in the graph
	for(i=0;i<nodes.length;i=i+1){
		edges = edges + nodes[i].neighbours.length;
	}
	var string = "<font size=5>Number of edges:" + edges + "<br><button onClick=\"clearMessages(-1)\">Ok</button>";
	document.getElementById("messages").innerHTML = string;
}

/**
	Draws all the nodes to the screen
*/
function drawNodes(){
	clearCanvas();
	var txt="<table border=1><tr><td>Node</td><td>Parent</td><td>SCC</td></tr>"; //Creates the table of the nodes
	for(i=0;i<nodes.length;i=i+1){
		var x = nodes[i].getX();
		var y = nodes[i].getY();
		var color="black";
		if(nodes[i].selected){
			color = "blue";
		}
		for(j=0;j<nodes[i].neighbours.length;j=j+1){ //Goes over all the neighbours of the current node
			var other = nodes[nodes[i].neighbours[j]];
			drawArrow(x,y,other.getX(),other.getY()); //Draws edges
		}
		drawCircle(x,y,NODE_RADIUS,color); //Draws the node
		if(showDFSOutput){
			var txtD = "d:" + nodes[i].getDiscovery() + "\n" + "f:" + nodes[i].getFinish(); //Draws the text on the node
			drawText(x-NODE_RADIUS/2,y-NODE_RADIUS/2,txtD);		
		}
		txt = txt + "<tr><td>" + i + "</td><td>" + nodes[i].pare + "</td><td>" + nodes[i].scc + "</td></tr>"; //Adds this node's row to the table
	}
	txt = txt + "</table>";
	document.getElementById("nodesTable").innerHTML = txt;
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

/**
	Revereses all the edges in the graph.
*/
function transpose(){
	nodes = createTranspose(nodes);
	drawNodes();
}

/**
	Create a directed edge between two nodes.
	@param ind1 The index of the first node.
	@param ind2 The index of the second node.
*/
function createEdge(ind1,ind2){
	var node1 = nodes[ind1];
	var node2 = nodes[ind2];
	node1.addNeighbour(ind2);
	clearMessages(ind1);
}

/**
	Constructs a new Node object
	
	@param x The x coordinate of the node.
	@param y The y coordinate of the node.
	@param ind The index of the node in the nodes list
*/
function Node(x,y,ind){
	this.neighbours = []; //Empty list of neighbours
	this.x = x; //X coordinate
	this.y = y; //Y coordinate
	this.ind = ind; //Index of the node
	this.selected = false; //True if this node is selected
	this.collided = false; //True if this node has collided with another
	this.color = 0; //Color of the node, used for DFS search
	this.d=-1; //Discovery time of the node, used for DFS search
	this.pare = -1; //Parent of the node, used for DFS search
	this.scc = -1; //The strongly connected component of this node.
	this.f=-1; //Finish time of the node, used for DFS search
}

Node.prototype={
	constructor:Node,
	/**
		Adds a new neighbour to this node's neighbours list.
		
		@param ind The index of the new neighbour.
	*/
	addNeighbour:function(ind){
		this.neighbours.push(ind);
	},
	/**
		Sets the location of this node.
		
		@param x The x coordinate of the node.
		@param y The y coordinate of the node.
	*/
	setLocation:function(x,y){
		this.x = x;
		this.y = y;
		drawNodes();
	},
	/**
		Returns the x coordinate of this node.
		
		@return The x coordinate of this node.
	*/
	getX:function(){
		return this.x;
	},
	/**
		Returns the y coordinate of this node.
		
		@return The y coordinate of this node.
	*/
	getY:function(){
		return this.y;
	},
	/**
		Returns the color of this node, used for DFS search.
		
		@return The color of this node in a DFS search.
	*/
	getColor:function(){
		return this.color;
	},
	/**
		Returns the discovery time of this node in a DFS search.
		
		@return The discovery time of this node in a DFS search.
	*/
	getDiscovery:function(){
		return this.d;
	},
	/**
		Returns the finish time of this node in a DFS search.
		
		@return The finish time of this node in a DFS search
	*/
	getFinish:function(){
		return this.f;
	},
	/**
		Sets the discovery time of this node.
		
		@param di The discovery time.
	*/
	setDiscovery:function(di){
		this.d = di;
	},
	/**
		Sets the finish time of this node.
		
		@param fi The finish time of this node.
	*/
	setFinish:function(fi){
		this.f = fi;
	},
	/**
		Returns a copy of this node, without it's neighbours.
		
		@return A copy of this node, without it's neighbours.
	*/
	copyNoNeigh:function(){
		/* Copies all the data of this node, but keeping the neighbours list empty */
		var ans = new Node(this.x,this.y,this.ind);
		ans.selected = this.selected;
		ans.collided = this.collided;
		ans.color = this.color;
		ans.d = this.d;
		ans.pare = this.pare;
		ans.scc = this.scc;
		ans.f=this.f;
		ans.neighbours = [];
		return ans;
	}
}

