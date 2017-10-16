const INIT_DFS_HEIGHT=300;
const INIT_DFS_TIME=600;
const INIT_BFS_HEIGHT = 400;
const INIT_BFS_TIME = 600;
var popupNodeDelay=1500;


/**
	Sets the delay of each progress of the algorithm
*/
function setDelay(){
	var slider = document.getElementById("algorithmDelay");
	popupNodeDelay = (10.5-parseInt(slider.value))*1000;
}

function runBFSVisFromNode(nodes,ind){
	hidePopup();
	showDFSOutput=false;
	showBFSOutput=true;
	nodes[ind].selected=false;
	var str = "foreach node v&isin;V\{s}<br><p style=\"margin-left:40px\">";
	str = str + "v.color &larr;&nbsp;white<br>v.d&larr;&nbsp;&inifn;<br>v.&pi;&larr;&nbsp;null</p>";
	str = str + "s.color &larr;&nbsp; gray <br>s.d&larr;&nbsp;0<br>s.&pi;&larr;&nbsp;null<br>";
	str = str + "Create Queue Q &larr; &nbsp; {s}";
	showComment("BFS Initialization",str,INIT_BFS_HEIGHT,function(){
		BFSInit(nodes,ind);
		var queue = new Queue();
		queue.enqueue(ind);
		openAdditionalInfo();
		BFSloop(nodes,queue);
	},INIT_BFS_TIME);
}

function BFSInit(nodes,ind){
	for(var i=0;i<nodes.length;i=i+1){
		nodes[i].color=0;
		nodes[i].d = Number.POSITIVE_INFINITY;
		nodes[i].pare = -1;
	}
	nodes[ind].color=1;
	nodes[ind].d = 0;
}

function BFSloop(nodes,queue){
	if(queue.isEmpty()){
	}else{
		ind = queue.deque();
		showPopupNodeMessage(ind,"BFS Visiting this node",popupNodeDelay,function(){
			BFSNeighboursLoop(nodes,ind,0,queue,function(){BFSloop(nodes,queue);});
		});
	}
}

function BFSNeighboursLoop(nodes,ind,i,queue,callback){
	if(i>=nodes[ind].neighbours.length){
		nodes[ind].color=2;
		drawNodes();
		callback();
	}else{
		currNode = nodes[nodes[ind].neighbours[i]];
		if(currNode.color==0){
			showPopupNodeMessage(nodes[ind].neighbours[i],"Adding this node to the queue",popupNodeDelay,function(){
				currNode.color=1;
				currNode.d = nodes[ind].d + 1;
				currNode.pare = ind;
				drawNodes();
				queue.enqueue(nodes[ind].neighbours[i]);
				BFSNeighboursLoop(nodes,ind,i+1,queue,callback);
			});
		}else{
			BFSNeighboursLoop(nodes,ind,i+1,queue,callback);
		}
	}			
}


function runDFSVisFromNode(nodes,ind){
	hidePopup();
	nodes[ind].selected = false;
	var string = "foreach node	v&isin;V do:<br><p style=\"margin-left: 40px\">";
	string = string + "d[u]&larr;&nbsp;-1<br>f[u]&larr;&nbsp;-1<br>&pi;[u]&larr;null<br>";
	string = string + "color[u]&larr;white";
	showComment("Initialization",string,INIT_DFS_HEIGHT,function(){
		DFSInit(nodes);
		openAdditionalInfo();
		showDFSOutput=true;
		dfsVisitVis(ind,nodes,function(){dfsLoop(0,nodes);});
	},INIT_DFS_TIME);
}

/**
	Runs a visualied version of the DFS algorithm on a given graph.
	
	@param nodes The nodes of the graph.
*/
function runDFSVis(nodes){
	var i;
	var string = "For each node	v&isin;V do:<br><p style=\"margin-left: 40px\">";
	string = string + "d[u]&larr;&nbsp;-1<br>f[u]&larr;&nbsp;-1<br>&pi;[u]&larr;null<br>";
	string = string + "color[u]&larr;white";
	showComment("Initialization",string,INIT_DFS_HEIGHT,function(){
		DFSInit(nodes);
		openAdditionalInfo();
		showDFSOutput=true;
		dfsLoop(0,nodes);
	},INIT_DFS_TIME);
}

/**
	Fills the DFS info to the additional info screen.
	
	@param nodes The nodes of the graph
*/
function fillDFSTable(nodes,ind,mode){
	var str = "<table class=\"DFSNodesTable\"><tr><th>Node</th><th>d</th><th>f</th><th>&pi;</th></tr>";
	for(var i=0;i<nodes.length;i=i+1){
		var pare = "null";
		var row = "<tr>";
		var finCell = "<td>";
		var disCell = "<td>";
		if(i==ind){
			row = "<tr style=\"background-color:#2d2d2d;color:white\">";
			if(mode=='f'){
				finCell = "<td style=\"color:red\">";
			}
			if(mode=='d'){
				disCell = "<td style=\"color:red\">";
			}	
		}
		if(nodes[i].pare!=-1){pare = nodes[i].pare;}
		str = str + row + "<td>" + i + "</td>" + disCell + nodes[i].d + "</td>" + finCell + nodes[i].f + "</td>" + disCell + pare;
		str = str + "</td></tr>";
	}
	str = str + "</table><br>";
	if(mode=='e'){
		str = str + "<input type=\"button\" onClick=\"dismissAdditInfo()\" value=\"Dismiss\">";
	}
	document.getElementById("additInfo").innerHTML = str;
}

/**
	The DFS loop, starts DFS search from each unvisited node.
	
	@param i The index of current node in the loop.
	@param cnodes The nodes of the graph
*/
function dfsLoop(i,cnodes){
	if(i>=cnodes.length){fillDFSTable(cnodes,-1,'e');return;}
	if(cnodes[i].getColor()==0){
		fillDFSTable(cnodes,i,'d');
		showPopupNodeMessage(i,"DFS visiting this node",popupNodeDelay,function(){
			dfsVisitVis(i,cnodes,function(){dfsLoop(i+1,cnodes);});
		});
	}else{
		dfsLoop(i+1,cnodes);
	}
}

/**
	This loop goes over all the neighbours of a given node, and DFSvisits them.
	After it finishes, calls a given callback function.
	
	@param i The index of the node.
	@param j The current index in the node's neighbours list.
	@param cnodes The nodes of the graph.
	@param callback The callback function to be called upon finish.
*/
function dfsNeighboursLoop(i,j,cnodes,callback){
	if(j>=cnodes[i].neighbours.length){
		fillDFSTable(cnodes,i,'f');
		showPopupNodeMessage(i,"Finishing with node",popupNodeDelay,function(){dfsFinishNode(i,cnodes);callback();});
	}else{
		neighbour = cnodes[cnodes[i].neighbours[j]];
		if(neighbour.getColor()==0){
			fillDFSTable(cnodes,cnodes[i].neighbours[j],'d');
			neighbour.pare = i;
			showPopupNodeMessage(cnodes[i].neighbours[j],"DFS visiting this node",popupNodeDelay,function(){
				dfsVisitVis(cnodes[i].neighbours[j],cnodes,function(){dfsNeighboursLoop(i,j+1,cnodes,callback);});
			});
		}else{
			dfsNeighboursLoop(i,j+1,cnodes,callback);
		}
	}
}

/**
	Finishs handling a given node.
	
	@param ind The index of the node.
	@param cnodes The nodes of the graph.
*/
function dfsFinishNode(ind,cnodes){
	node = cnodes[ind];
	node.color = 2;
	node.f = time;
	time = time + 1;
	drawNodes();
}

/**
	DFSVisit of the visualized DFS algorithm.
	
	@param ind The index of the node.
	@param cnodes The nodes of the graph.
	@param callback The callback to be called after finish the visit.
*/
function dfsVisitVis(ind,cnodes,callback){
	node = cnodes[ind];
	node.color = 1;
	drawNodes();
	node.d = time;
	time = time + 1;
	dfsNeighboursLoop(ind,0,cnodes,callback);
}