var nodes =[]; //The list of the nodes
var nodeCount=0;
var lastX=20; //The last x coordinate of the node selected before selection
var lastY=20; //The last y coordinate of the node selected before selection
var showDFSOutput=false; //If true, discovery time and finish time will be shown for each node
var indNodeFrom=-1;
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
	Sets the index of the node from which an edge would leave.
	
	@param The index of the node
*/
function edgeFrom(ind){
	indNodeFrom = ind;
	nodes[ind].selected = false;
	drawNodes();
	hidePopup();
}
	

/**
	Prints the number of vertices to the screen
*/
function getVertNum(){
	var string = "<font size=5>Number of vertices:" + nodes.length + "<br><button onClick=\"clearMessages(-1)\">Ok</button>";
	document.getElementById("messageBox").innerHTML = string;
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
	document.getElementById("messageBox").innerHTML = string;
}

/**
	Removes a selected node from the graph.
	
	@param ind The index of the node to be removed.
*/
function removeNode(ind){
	for(i=0;i<nodes.length;i=i+1){
		if(i!=ind){
			var found=false;
			for(j=0;j<nodes[i].neighbours.length && !found;j=j+1){
				if(nodes[i].neighbours[j]==ind){
					nodes[i].neighbours.splice(j,1);
				}
			}
		}
	}
	nodes.splice(ind,1);
	for(i=ind;i<nodes.length;i=i+1){
		var node = nodes[i];
		node.ind = node.ind - 1;
	}
	for(i=0;i<nodes.length;i=i+1){
		for(j=0;j<nodes[i].neighbours.length;j=j+1){
			if(nodes[i].neighbours[j]>ind){
				nodes[i].neighbours[j] = nodes[i].neighbours[j]-1;
			}
		}
	}
	hidePopup();
	drawNodes();
}

/**
	Draws all the nodes to the screen
*/
function drawNodes(){
	clearCanvas();
	var txt="<table id=\"dataTable\" cellspacing=0><tr><th>Node</th><th>Parent</th><th>SCC</th></tr>"; //Creates the table of the nodes
	for(i=0;i<nodes.length;i=i+1){
		var x = nodes[i].getX();
		var y = nodes[i].getY();
		var color="black";
		var rowType="regularRow";
		for(j=0;j<nodes[i].neighbours.length;j=j+1){ //Goes over all the neighbours of the current node
			color = "black";
			if(selectedEdge[0]==i && selectedEdge[1]==j){
				color = "blue";
			}
			var other = nodes[nodes[i].neighbours[j]];
			drawArrow(x,y,other.getX(),other.getY(),color); //Draws edges
			color = "black";
		}
		if(nodes[i].selected){
			color = "blue";
			rowType = "selectedRow";
		}
		drawCircle(x,y,NODE_RADIUS,color); //Draws the node
		if(showDFSOutput){
			var txtD = "d:" + nodes[i].getDiscovery() + "\n" + "f:" + nodes[i].getFinish(); //Draws the text on the node
			drawText(x-NODE_RADIUS/2,y-NODE_RADIUS/2,txtD);		
		}
		txt = txt + "<tr id=\"" + rowType + "\"><td>" + i + "</td><td>" + nodes[i].pare + "</td><td>" + nodes[i].scc + "</td></tr>"; //Adds this node's row to the table
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
	document.getElementById("messageBox").innerHTML="";
}

/**
	Removes the edge that goes from the node in index ind1, to the node of index ind2.
	
	@param ind1 The first index
	@param ind2 The second index
*/
function removeEdge(ind1,ind2){
	var node = nodes[ind1];
	node.removeEdge(ind2);
	drawNodes();
	hidePopup();
}

/**
	Hides the nodes control panel.
*/
function hideControlPanel(){
	document.getElementById("nodeControlPanel").style.visibility="collapse";
	drawNodes();
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
	console.log("creating");
	var node1 = nodes[ind1];
	var node2 = nodes[ind2];
	node1.addNeighbour(ind2);
	nodes[ind1].selected=false;
	nodes[ind2].selected=false;
	indNodeFrom = -1;
	hidePopup();
	drawNodes();
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
		Removes an edge from this node to another.
		
		@param ind The index of the other node.
	*/
	removeEdge:function(ind){
		var del=-1; //The index to remove
		for(j=0;j<this.neighbours.length && del==-1;j=j+1){
			if(this.neighbours[j]==ind){
				del = j;
			}
		}
		if(del!=-1){
			this.neighbours.splice(del,1);
		}
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

/**
	Creates a new line object, which goes from point (x1,y1) to point (x2,y2)
	
	@param x1 The first x coordinate
	@param y1 The first y coordinate
	@param x2 The second x coordinate
	@param y2 The second y coordinate
*/
function Line(x1,y1,x2,y2){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.vertical = x1==x2;
	if(!this.vertical){
		this.m = (y2-y1)/(x2-x1);
		this.n = y2 - this.m*x2;
	}else{
		this.m = Number.POSITIVE_INFINITY;
		this.n = undefined;
	}
}

Line.prototype={
	constructor:Line,
	/**
		Returns the y point on the line y=mx+n.
		
		@param x The x value
		@return The y value of the given x.
	*/
	getY:function(x){
		if(!this.vertical){
			return (this.m)*x + (this.n);
		}
	},
	/**
		Returns the x value on the line of a given y value.
		
		@param y The given y value
		@return The x value of this y value.
	*/
	getX:function(y){
		if(this.vertical){
			return x1;
		}else{
			console.log("get");
			return (y-n)/m;
		}
	},
	/**
		Returns true if a given point (x,y) is on the line. Takes into account the line's width.
		
		@param x The x coordinate of the point.
		@param y The y coordinate of the point.
		@param width The line's width.
	*/
	onLine:function(x,y,width){
		if(this.vertical){
			var ym = Math.min(this.y1,this.y2);
			var yM = Math.max(this.y1,this.y2);
			return (y>=ym && y<=yM && x>=x1-width && x<=x1+width);
		}else{
			var xm = Math.min(this.x1,this.x2);
			var xM = Math.max(this.x1,this.x2);
			var y0 = this.getY(x);
			return (x>=xm && x<=xM && y>=y0-width && y<=y0+width);
		}
	}
}

