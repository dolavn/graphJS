const INIT_DFS_HEIGHT=300;
const INIT_DFS_TIME=6000;
var popupNodeDelay=1500;


/**
	Sets the delay of each progress of the algorithm
*/
function setDelay(){
	var slider = document.getElementById("algorithmDelay");
	popupNodeDelay = (10.5-parseInt(slider.value))*1000;
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
		//openAdditionalInfo();
		showDFSOutput=true;
		dfsLoop(0,nodes);
	},INIT_DFS_TIME);
}

/**
	The DFS loop, starts DFS search from each unvisited node.
	
	@param i The index of current node in the loop.
	@param cnodes The nodes of the graph
*/
function dfsLoop(i,cnodes){
	if(i>=cnodes.length){return;}
	if(cnodes[i].getColor()==0){
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
	console.log("node :" + i + " j:" + j);
	if(j>=cnodes[i].neighbours.length){
		showPopupNodeMessage(i,"Finishing with node",popupNodeDelay,function(){dfsFinishNode(i,cnodes);callback();});
	}else{
		neighbour = cnodes[cnodes[i].neighbours[j]];
		if(neighbour.getColor()==0){
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
	console.log("finishing with node " + ind);
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
	console.log("visiting " + ind);
	node.color = 1;
	drawNodes();
	node.d = time;
	time = time + 1;
	dfsNeighboursLoop(ind,0,cnodes,callback);
}