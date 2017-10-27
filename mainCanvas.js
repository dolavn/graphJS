var currGraph; //The current graph displayed on the main canvas.
var indNodeFrom=-1;
const NODE_RADIUS=25; //The radius of the node
const THUMBNAIL_RADIUS=10; //The radius of the node in thumbnail view
const NODE_WEIGHT_TEXT_OFFSET=25; //Offset of the text of the weight from the line
var lastX=20; //The last x coordinate of the node selected before selection
var lastY=20; //The last y coordinate of the node selected before selection
var showDFSOutput=false; //If true, discovery time and finish time will be shown for each node
var showBFSOutput=false; //If true, distance of every node will be shown.

/**
	Initializes the current graph.
*/
function setupGraph(){
	currGraph = new Graph(true,false,"Untitled graph",-1);
}

/**
	Sets the current graph name
*/
function changeGraphName(){
	var name = document.getElementById("graphNameTxt").value;
	currGraph.setName(name);
	document.getElementById("saveButton").disabled=false;
	hideGraphName();
	drawNodes();
}

/**
	Toggles the weighted option for the current graph
*/
function setWeighted(){
	var c = true;
	if(currGraph.getNodesNum()>0){
		c = confirm("Are you sure? The current graph will be deleted after changing a graph option");
	}
	if(c){
		currGraph = new Graph(currGraph.directed,!currGraph.weighted,currGraph.name,-1);
		drawNodes();
	}
}

/**
	Toggles the directed option for the current graph
*/
function setDirected(){
	var c = true;
	if(currGraph.getNodesNum()>0){
		c = confirm("Are you sure? The current graph will be deleted after changing a graph option");
	}
	if(c){
		currGraph = new Graph(!currGraph.directed,currGraph.weighted,currGraph.name,-1);
		document.getElementById("buttonTranspose").disabled = !currGraph.directed;
		drawNodes();
	}
}

/**
	Loads a graph the main canvas
*/
function loadGraphToMainCanvas(graph_id){
	loadGraph(graph_id,null,loadNodes);
	document.getElementById("saveButton").disabled=false;
	hideLoadGraph();
	
}

/**
	Loads a graph from the graph database, then executes a callback function.
	
	@param graph_id The id of the graph to be loaded.
	@param callBackParams The parameters to be delivered to the callback function
	@param callback The callback function to be executed
*/
function loadGraph(graph_id,callBackParams,callback){
	var url = "loadGraph.php";
	var params = "graph_id=" + graph_id;
	var http = new XMLHttpRequest();
	currGraphId=graph_id;
	http.open("POST",url,true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			var graph = decodeGraph(http.responseText);
			if(callBackParams==null){
				callback(graph);
			}else{
				callback(graph,callBackParams);
			}
		}
	}
	http.send(params);
}

/**
	Saves the current graph the database
*/
function saveGraph(){
	var url = "saveGraph.php";
	var directed = 0;
	var weighted = 0;
	if(currGraph.directed){
		directed = 1;
	}
	if(currGraph.weighted){
		weighted = 1;
	}
	var params = "graph_id=" + currGraphId + "&graph_name=" + graphName + "&directed=" + directed + "&weighted=" + weighted + "&nodes=";
	if(currGraph.nodes.length>0){
		for(i=0;i<currGraph.nodes.length;i=i+1){
			var node = currGraph.getNode(i);
			var nodeStr =  node.getDatabaseIndex() + "@" + node.ind + "@" + node.x + "@" + node.y;
			for(j=0;j<node.getNeighboursNum();j=j+1){
				nodeStr = nodeStr + "@" + node.getNeighbour(j) + "|" + node.getWeight(node.getNeighbour(j));
			}
			params = params + nodeStr + "$";
		}
		params = params.substr(0,params.length-1);
	}
	alert(params);
	var http = new XMLHttpRequest();
	http.open("POST",url,true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			alert(http.responseText);
		}
	}
	http.send(params);
}

/**
	Decodes the graph data from a string delivered by the php script.
	
	@param str A string containing the decoded graph.
*/
function decodeGraph(str){
	str = str.substr(1,str.length-2);
	var res = str.split("$");
	var graphId = res[0];
	var name = res[1];
	var directedObj = res[2];
	var weightedObj = res[3];
	graphName = name;
	var nodesList=[];
	for(i=4;i<res.length;i=i+1){
		var nodeStr = res[i].split("?");
		var id=parseInt(nodeStr[0]); var ind = parseInt(nodeStr[1]); var x = parseInt(nodeStr[2]); var y=parseInt(nodeStr[3]);
		var currNode = new Node(x,y,ind);
		currNode.setDatabaseIndex(id);
		for(j=4;j<nodeStr.length;j=j+1){
			if(nodeStr[j]!=-1){ //-1 Indicates no neighbours for this node.
				var currEdgeStr= nodeStr[j].split("|");
				var ind = parseInt(currEdgeStr[0]);
				var weight = parseInt(currEdgeStr[1]);
				currNode.addNeighbour(ind);
				currNode.setWeight(ind,weight);
			}
		}
		nodesList.push(currNode);
	}
	return new Graph(nodesList,directedObj==1,weightedObj==1,name,graphId);
}

/**
	Loads a new graph to the current graph.
*/
function loadNodes(newGraph){
	currGraph = newGraph;
	document.getElementById("directedGraph").checked = currGraph.directed; //Sets the checkbox according to this graph
	document.getElementById("weightedGraph").checked = currGraph.weighted; //Sets the checkbox according to this graph
	findSCC(currGraph.nodes);
	drawNodes();
}

/**
	Calculates the canvas width.
*/
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
	var node = new Node(lastX,lastY,currGraph.getNodesNum()); //Creates the node
	currGraph.addNode(node);
	findSCC(currGraph.nodes);
	drawNodes(); //Draws the node
}

/**
	Sets the index of the node from which an edge would leave.
	
	@param The index of the node
*/
function edgeFrom(ind){
	indNodeFrom = ind;
	currGraph.getNode(ind).selected = false;
	drawNodes();
	hidePopup();
}
	

/**
	Prints the number of vertices to the screen
*/
function getVertNum(){
	var string = "Number of vertices:" + currGraph.getNodesNum() + "<br><input type=\"button\" onClick=\"clearMessages(-1)\" value=\"Ok\">";
	document.getElementById("messages").innerHTML = string;
}

/**
	Prints the number of edges to the screen
*/
function getEdgeNum(){
	var string = "Number of edges:" + currGraph.getEdgesNum() + "<br><input type=\"button\" onClick=\"clearMessages(-1)\" value=\"Ok\">";
	document.getElementById("messages").innerHTML = string;
}

/**
	Removes a selected node from the graph.
	
	@param ind The index of the node to be removed.
*/
function removeNode(ind){
	currGraph.removeNode(ind);
	hidePopup();
	drawNodes();
}

/**
	Fills a thumbnail with a specific graph
	
	@param graph The graph to be drawn
	@param canvas The canvas on which to draw
*/
function fillThumbnail(graph,canvas){
	for(i=0;i<graph.getNodesNum();i=i+1){
		var node = graph.getNode(i);
		drawNode(graph,node,THUMBNAIL_RADIUS,SMALL_ARROW,canvas,true);
	}
}

function drawNodesThumbnail(graph_id){
	var str = "graph" + graph_id;
	canvas = document.getElementById(str);
	loadGraph(graph_id,canvas,fillThumbnail);
}

/**
	Draws a given node to a given canvas, draws also all edges from that node.
	
	@param graph The graph this node belonging to
	@param node The node to be drawn
	@param node_radius The radius of the circle representing this node
	@param arrow_length The length of the arrow head for directed edges
	@param canvas The canvas on which to draw this node
	@param thumbnail A flag, set to true only if this node is drawn on thumbnail mode (resizing needed)
*/
function drawNode(graph,node,node_radius,arrow_length,canvas,thumbnail){
	var x = node.getX(); 
	var y = node.getY();
	if(thumbnail){
		var maxX = Number.NEGATIVE_INFINITY;
		var maxY = Number.NEGATIVE_INFINITY;
		var nodes = graph.nodes;
		for(var i=0;i<nodes.length;i=i+1){
			if(nodes[i].x>maxX){maxX = nodes[i].x;}
			if(nodes[i].y>maxY){maxY = nodes[i].y;}
		}
		var canvasWidth = $(canvas).width();
		var canvasHeight = $(canvas).height();
		var ratioX = (canvasWidth-node_radius)/maxX;
		var ratioY = (canvasHeight-node_radius)/maxY;
		x = x * ratioX;
		y = y * ratioY;
	}
	var color="black";
	var rowSelected=false;
	for(j=0;j<node.getNeighboursNum();j=j+1){ //Goes over all the neighbours of the current node, to draw edges
		color = "black";
		if(!thumbnail && selectedEdge[0]==node.ind && selectedEdge[1]==node.getNeighbour(j)){
			color = "blue";
		}
		var other = graph.getNode(node.getNeighbour(j));
		if(other.visible){ //Draws the edge
			var otherX = other.getX(); var otherY = other.getY();
			if(thumbnail){
				otherX = otherX * ratioX;
				otherY = otherY * ratioY;
			}
			if(graph.directed){
				drawArrow(x,y,otherX,otherY,color,arrow_length,node_radius,canvas); //Directed graph, draws an arrow
			}else{
				if(node.ind<node.getNeighbour(j)){ //Should only draws the line once, so checks if the index of the first node is smaller.
					drawLineCorr(x,y,otherX,otherY,color,node_radius,canvas); //Undirected graph draws a line.
				}
			}
			color = "black";
			if(!thumbnail && graph.weighted){ //Draws the text for the weight
				var line = new Line(x,y,other.getX(),other.getY());
				var point = line.getOffset(NODE_WEIGHT_TEXT_OFFSET);
				var weight = node.getWeight(node.getNeighbour(j));
				drawText(point.x,point.y,weight,"black",15,canvas);
			}
		}
	}
	if(!thumbnail){
		if(node.selected){
			color = "blue";
		}
		var txtColor = "black";
		if(node.color==1){
			fillCircle(x,y,node_radius,"gray",canvas); //fills the node during dfs
		}
		if(node.color==2){
			fillCircle(x,y,node_radius,"black",canvas); //fills the node during dfs
			txtColor = "white";
		}
		if(showDFSOutput){
			var txtD = "d:" + node.getDiscovery() + "\n" + "f:" + node.getFinish(); //Draws the text on the node
			drawText(x-node_radius/2,y-node_radius/2,txtD,txtColor,10,canvas);		
		}
		if(showBFSOutput){
			var dixtText = "&infin;";
			if(node.d!=Number.POSITIVE_INFINITY){distText = node.d;}
			var txtD = "d:" + node.d;
			drawText(x-node_radius/2,y-node_radius/2,txtD,txtColor,14,canvas);	
		}
	}
	drawCircle(x,y,node_radius,color,canvas); //Draws the node

}

/**
	Checks if a given node is out of the canvas, if so, changes it's location accordingly.
	
	@param node The node to be checked
	@param canvas The canvas
*/
function checkNodeOutOfBounds(node,canvas){
	var width = $(canvas).width();
	var height = $(canvas).height();
	/* Checks that the node isn't out of the bounds of the canvas, if so, changes it's position */
	if(node.getX()>width-NODE_RADIUS){
		node.x = width-NODE_RADIUS;
	}
	if(node.getX()<NODE_RADIUS){
		node.x = NODE_RADIUS;
	}
	if(node.getY()>height-NODE_RADIUS){
		node.y = height-NODE_RADIUS;
	}
	if(node.getY()<NODE_RADIUS){
		node.y = NODE_RADIUS;
	}
}

/**
	Draws all the nodes to the screen
*/
function drawNodes(){
	var canvas = document.getElementById("drawCanvas");
    var currGraphNameLabel = document.getElementById("currentGraph");
    if(currGraphNameLabel!=null){
		currGraphNameLabel.innerHTML = currGraph.name;
	}
	clearCanvas(canvas);
	var txt = "<table class=\"nodesTable\"><tr style=\"height:100px\"><td><input type=\"button\" onClick=\"showAdjMatrix(currGraph)\" value=\"Show adjacency matrix\"></td></tr>";
	/*A loop that goes over all the nodes in the graph */
	for(i=0;i<currGraph.getNodesNum();i=i+1){
		var currNode = currGraph.getNode(i);
		checkNodeOutOfBounds(currNode,canvas);
		if(currNode.visible){ //If the node is visible, draws it.
			drawNode(currGraph,currNode,NODE_RADIUS,BIG_ARROW,canvas,false);
		}
		txt = txt + "<tr style=\"height:100px\"><td><div style=\"width:100%;height:25px;background-color:#4E4D4E;color:white\">";
		txt = txt +"Node" + currNode.ind + "</div>";
		txt = txt + "<label class=\"checkContainer\">Visible<input type=\"checkBox\"";
		if(currNode.visible){ txt = txt + " checked=\"checked\"";}
		txt = txt + " onClick=\"changeVis(" + i +")\">";
		txt = txt + "<span class=\"checkmark\"></span></label>";
		txt = txt + "SCC:" + currNode.scc;
		txt = txt + "</td></tr>";
	}
	txt = txt + "<tr><td></td></tr>";
	document.getElementById("nodesTableCell").innerHTML  = txt;
}

/**
	Removes the edge that goes from the node in index ind1, to the node of index ind2.
	
	@param ind1 The first index
	@param ind2 The second index
*/
function removeEdge(ind1,ind2){
	var node = currGraph.getNode(ind1);
	node.removeEdge(ind2);
	if(!currGraph.directed){
		currGraph.getNode(ind2).removeEdge(ind1);
	}
	drawNodes();
	hidePopup();
}

/**
	Creates the complement graph to the current graph.
*/
function complement(){
	currGraph.nodes = complGraph(currGraph.nodes);
	drawNodes();
}

/**
	Revereses all the edges in the graph.
*/
function transpose(){
	currGraph.nodes = createTranspose(currGraph.nodes);
	drawNodes();
}

/**
	Create a directed edge between two nodes.
	@param ind1 The index of the first node.
	@param ind2 The index of the second node.
*/
function createEdge(ind1,ind2){
	var node1 = currGraph.getNode(ind1);
	var node2 = currGraph.getNode(ind2);
	node1.addNeighbour(ind2);
	if(!currGraph.directed){
		node2.addNeighbour(ind1);
	}
	node1.selected=false;
	node2.selected=false;
	indNodeFrom = -1;
	hidePopup();
	findSCC(currGraph.nodes);
	drawNodes();
}

/**
	Toggles the visibility of a given node.
	
	@param ind The index of the node.
*/
function changeVis(ind){
	currGraph.nodes(ind).visible = !currGraph.nodes(ind).visible;
	drawNodes();
}
