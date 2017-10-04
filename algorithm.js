var time=0;

function DFSInit(nodes){
	var i;
	for(i=0;i<nodes.length;i=i+1){
		var node = nodes[i];
		node.d=-1;
		node.f=-1;
		time=0;
		node.color=0;
		node.pare=null;
	}
}

function runDFS(nodes){
	var i;
	DFSInit(nodes);
	for(i=0;i<nodes.length;i=i+1){
		if(nodes[i].getColor()==0){
			dfsVisit(nodes[i]);
		}
	}
	drawNodes();
}

function dfsVisit(node){
	node.color = 1;
	node.d = time;
	time = time + 1;
	var i;
	for(i=0;i<node.neighbours.length;i=i+1){
		neighbour = node.neighbours[i];
		if(neighbour.getColor()==0){
			neighbour.pare = node;
			dfsVisit(neighbour);
		}
	}
	node.color =2;
	node.f = time;
	time = time + 1;
}