var nodes =[]; //The list of the nodes
var directedGraph=true;
var weightedGraph=false;
var nodeCount=0;
var lastX=20; //The last x coordinate of the node selected before selection
var lastY=20; //The last y coordinate of the node selected before selection
var showDFSOutput=false; //If true, discovery time and finish time will be shown for each node
var showBFSOutput=false; //If true, distance of every node will be shown.
var indNodeFrom=-1;
var graphName = "Untitled graph";
var currGraphId = -1;
const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const NODE_RADIUS=25; //The radius of the node
const THUMBNAIL_RADIUS=10;

function changeGraphName(){
	var name = document.getElementById("graphNameTxt").value;
	graphName = name;
	document.getElementById("saveButton").disabled=false;
	hideGraphName();
	drawNodes();
}

function setWeighted(){
	var c = true;
	if(nodes.length>0){
		c = confirm("Are you sure? The current graph will be deleted after changing a graph option");
	}
	if(c){
		nodes = [];
		weightedGraph = !weightedGraph;
		drawNodes();
	}
}

function setDirected(){
	var c = true;
	if(nodes.length>0){
		c = confirm("Are you sure? The current graph will be deleted after changing a graph option");
	}
	if(c){
		nodes = [];
		directedGraph = !directedGraph;
		drawNodes();
	}
}

function loadGraphToMainCanvas(graph_id){
	var nodes = loadGraph(graph_id,null,loadNodes).nodes;
	document.getElementById("saveButton").disabled=false;
	hideLoadGraph();
	
}

function loadGraph(graph_id,callBackParams,callback){
	var url = "loadGraph.php";
	var params = "graph_id=" + graph_id;
	var http = new XMLHttpRequest();
	currGraphId=graph_id;
	http.open("POST",url,true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			var graph = decodeGraph(http.responseText);
			var nodes = graph.nodes;
			if(params==null){
				callback(nodes);
			}else{
				callback(nodes,graph.directed,callBackParams);
			}
		}
	}
	http.send(params);
}

function saveGraph(){
	var url = "saveGraph.php";
	var directed = 0;
	if(directedGraph){
		directed = 1;
	}
	var params = "graph_id=" + currGraphId + "&graph_name=" + graphName + "&directed=" + directed + "&weighted=0" + "&nodes=";
	if(nodes.length>0){
		for(i=0;i<nodes.length;i=i+1){
			var node = nodes[i];
			var nodeStr =  nodes[i].getDatabaseIndex() + "@" + nodes[i].ind + "@" + nodes[i].x + "@" + nodes[i].y;
			for(j=0;j<node.neighbours.length;j=j+1){
				nodeStr = nodeStr + "@" + node.neighbours[j] + "|" + "1";
			}
			params = params + nodeStr + "$";
		}
		params = params.substr(0,params.length-1);
	}
	alert(params);
	var http = new XMLHttpRequest();
	http.open("POST",url,true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			alert(http.responseText);
		}
	}
	http.send(params);
}

function decodeGraph(str){
	str = str.substr(1,str.length-2);
	var res = str.split("$");
	var name = res[0];
	var directedObj = res[1];
	var weightedObj = res[2];
	graphName = name;
	var nodesList=[];
	for(i=3;i<res.length;i=i+1){
		var nodeStr = res[i].split("?");
		var id=parseInt(nodeStr[0]); var ind = parseInt(nodeStr[1]); var x = parseInt(nodeStr[2]); var y=parseInt(nodeStr[3]);
		var currNode = new Node(x,y,ind);
		currNode.setDatabaseIndex(id);
		for(j=4;j<nodeStr.length;j=j+1){
			if(nodeStr[j]!=-1){
				currNode.addNeighbour(parseInt(nodeStr[j]));
			}
		}
		nodesList.push(currNode);
	}
	return {nodes:nodesList,directed:directedObj,weighted:weightedObj};
}

function loadNodes(newNodes){
	nodes = newNodes;
	nodeCount = nodes.length;
	findSCC(nodes);
	drawNodes();
}


function calcCanvasWidth(){
	windowWidth = $(window).width();
}

/**
	Adds a new node to the node list.
*/
function addNode(){
	var saveButton = document.getElementById("saveButton");
        if(saveButton!=null){
            document.getElementById("saveButton").disabled=false;
        }
	var width = $(drawCanvas).width();
	var height = $(drawCanvas).height();
	var x = Math.random()*(width-NODE_RADIUS); //Random x coordinate
	var y = Math.random()*(height-NODE_RADIUS); //Random y coordinate
	lastX = x; //Changes the last x to be the x of the new node
	lastY = y; //Changes the last y to be the y of the new node
	var node = new Node(lastX,lastY,nodeCount); //Creates the node
	nodeCount = nodeCount + 1;
	node.setLocation(lastX,lastY); //Sets the node's location
	nodes.push(node); //Adds the node to the nodes list
	findSCC(nodes);
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
	var string = "Number of vertices:" + nodes.length + "<br><input type=\"button\" onClick=\"clearMessages(-1)\" value=\"Ok\">";
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
	if(!directedGraph){edges = edges/2;}
	var string = "Number of edges:" + edges + "<br><input type=\"button\" onClick=\"clearMessages(-1)\" value=\"Ok\">";
	document.getElementById("messages").innerHTML = string;
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
	/*
		Offsetting all the indices of the nodes whose index is greater then i by 1
	*/
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

function fillThumbnail(nodes,directed,canvas){
	var maxX = Number.NEGATIVE_INFINITY;
	var maxY = Number.NEGATIVE_INFINITY;
	var i;
	for(i=0;i<nodes.length;i=i+1){
		var node = nodes[i];
		if(node.x>maxX){maxX = node.x;}
		if(node.y>maxY){maxY = node.y;}
	}
	var ratioX = (CANVAS_WIDTH-THUMBNAIL_RADIUS)/maxX;
	var ratioY = (CANVAS_HEIGHT-THUMBNAIL_RADIUS)/maxY;
	for(i=0;i<nodes.length;i=i+1){
		var node = nodes[i];
		var x = node.x*ratioX;
		var y = node.y*ratioY;
		drawCircle(x,y,THUMBNAIL_RADIUS,"black",canvas);
		for(var j=0;j<node.neighbours.length;j=j+1){
			var neighbour = nodes[node.neighbours[j]];
			var otherX = neighbour.x*ratioX;
			var otherY = neighbour.y*ratioY;
			if(directed==1){
				drawArrow(x,y,otherX,otherY,"black",SMALL_ARROW,THUMBNAIL_RADIUS,canvas);
			}else{
				drawLineCorr(x,y,otherX,otherY,"black",THUMBNAIL_RADIUS,canvas);
			}
		}
	}
}

function drawNodesThumbnail(graph_id){
	var str = "graph" + graph_id;
	canvas = document.getElementById(str);
	loadGraph(graph_id,canvas,fillThumbnail);
}

/**
	Draws all the nodes to the screen
*/
function drawNodes(){
	var canvas = document.getElementById("drawCanvas");
        var currGraphName = document.getElementById("currentGraph");
        if(currGraphName!=null){
            document.getElementById("currentGraph").innerHTML = graphName;
        }
	clearCanvas(canvas);
	var txt = "<table class=\"nodesTable\"><tr style=\"height:100px\"><td><input type=\"button\" onClick=\"showAdjMatrix(nodes)\" value=\"Show adjacency matrix\"></td></tr>";
	//var txt="<table id=\"dataTable\" cellspacing=0><tr><th>Node</th><th>Parent</th><th>SCC</th></tr>"; //Creates the table of the nodes
	for(i=0;i<nodes.length;i=i+1){
		var width=$(drawCanvas).width();
		var height=$(drawCanvas).height();
		if(nodes[i].getX()>width-NODE_RADIUS){
			nodes[i].x = width-NODE_RADIUS;
		}
		if(nodes[i].getX()<NODE_RADIUS){
			nodes[i].x = NODE_RADIUS;
		}
		if(nodes[i].getY()>height-NODE_RADIUS){
			nodes[i].y = height-NODE_RADIUS;
		}
		if(nodes[i].getY()<NODE_RADIUS){
			nodes[i].y = NODE_RADIUS;
		}
		if(nodes[i].visible){
			var x = nodes[i].getX();
			var y = nodes[i].getY();
			var color="black";
			var rowSelected=false;
			for(j=0;j<nodes[i].neighbours.length;j=j+1){ //Goes over all the neighbours of the current node
				color = "black";
				if(selectedEdge[0]==i && selectedEdge[1]==j){
					color = "blue";
				}
				var other = nodes[nodes[i].neighbours[j]];
				if(other.visible){ //Draw the edge
					if(directedGraph){
						drawArrow(x,y,other.getX(),other.getY(),color,BIG_ARROW,NODE_RADIUS,canvas); //Directed graph, draws an arrow
					}else{
						if(i<nodes[i].neighbours[j]){ //Should only draws the line once, so checks if the index of the first node is smaller.
							drawLineCorr(x,y,other.getX(),other.getY(),color,NODE_RADIUS,canvas); //Undirected graph draws a line.
						}
					}
					color = "black";
				}
			}
			if(nodes[i].selected){
				color = "blue";
			}
			var txtColor = "black";
			if(nodes[i].color==1){
				fillCircle(x,y,NODE_RADIUS,"gray",canvas); //fills the node during dfs
			}
			if(nodes[i].color==2){
				fillCircle(x,y,NODE_RADIUS,"black",canvas); //fills the node during dfs
				txtColor = "white";
			}
			drawCircle(x,y,NODE_RADIUS,color,canvas); //Draws the node
			if(showDFSOutput){
				var txtD = "d:" + nodes[i].getDiscovery() + "\n" + "f:" + nodes[i].getFinish(); //Draws the text on the node
				drawText(x-NODE_RADIUS/2,y-NODE_RADIUS/2,txtD,txtColor,10,canvas);		
			}
			if(showBFSOutput){
				var dixtText = "&infin;";
				if(nodes[i].d!=Number.POSITIVE_INFINITY){distText = nodes[i].d;}
				var txtD = "d:" + nodes[i].d;
				drawText(x-NODE_RADIUS/2,y-NODE_RADIUS/2,txtD,txtColor,14,canvas);	
			}
		}
		
		txt = txt + "<tr style=\"height:100px\"><td><div style=\"width:100%;height:25px;background-color:#4E4D4E;color:white\">";
		txt = txt +"Node" + nodes[i].ind + "</div>";
		txt = txt + "<label class=\"checkContainer\">Visible<input type=\"checkBox\"";
		if(nodes[i].visible){ txt = txt + " checked=\"checked\"";}
		txt =txt + " onClick=\"changeVis(" + i +")\">";
		txt = txt + "<span class=\"checkmark\"></span></label>";
		txt = txt + "SCC:" + nodes[i].scc;
		txt = txt + "</td></tr>";
		//txt = txt + "<tr id=\"" + rowType + "\"><td>" + i + "</td><td>" + nodes[i].pare + "</td><td>" + nodes[i].scc + "</td></tr>"; //Adds this node's row to the table
	}
	txt = txt + "<tr><td></td></tr>";
	document.getElementById("nodesTableCell").innerHTML  = txt;
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
	Removes the edge that goes from the node in index ind1, to the node of index ind2.
	
	@param ind1 The first index
	@param ind2 The second index
*/
function removeEdge(ind1,ind2){
	var node = nodes[ind1];
	node.removeEdge(ind2);
	if(!directedGraph){
		nodes[ind2].removeEdge(ind1);
	}
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
	Creates the complement graph to the current graph.
*/
function complement(){
	nodes = complGraph(nodes);
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
	var node1 = nodes[ind1];
	var node2 = nodes[ind2];
	node1.addNeighbour(ind2);
	if(!directedGraph){
		node2.addNeighbour(ind1);
	}
	nodes[ind1].selected=false;
	nodes[ind2].selected=false;
	indNodeFrom = -1;
	hidePopup();
	findSCC(nodes);
	drawNodes();
}

/**
	Toggles the visibility of a given node.
	
	@param ind The index of the node.
*/
function changeVis(ind){
	nodes[ind].visible = !nodes[ind].visible;
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
	this.dbID=-1 //The index stored in the database
	this.visible =  true; //Visibility of this node
}

Node.prototype={
	constructor:Node,
	/**
		Adds a new neighbour to this node's neighbours list.
		
		@param ind The index of the new neighbour.
	*/
	addNeighbour:function(ind){
		this.neighbours.push([ind,1]);
	},
	/**
		Sets the database index of this node.
		
		@param id The database index.
	*/
	setDatabaseIndex:function(id){
		this.dbID = id;
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
		Returns the database index of this node.
		
		@return The database index of this node.
	*/
	getDatabaseIndex:function(){
		return this.dbID;
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
			if(this.neighbours[j][0]==ind){
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

