var time=0;

function DFSInit(nodes){
	var i;
	for(i=0;i<nodes.length;i=i+1){
		var node = nodes[i];
		node.d=-1;
		node.f=-1;
		time=0;
		node.color=0;
		node.pare=-1;
	}
}

function findSCC(nodes){
	DFSInit(nodes);
	var transp = createTranspose(nodes);
	runDFS(nodes);
	var i;
	var count = 0;
	var cont = true;
	while(cont){
		var j;
		var max = Number.NEGATIVE_INFINITY;
		var maxInd =-1;
		for(j=0;j<nodes.length;j=j+1){
			if(transp[j].color==0){
				if(nodes[j].f>max){
					maxInd = j;
					max = nodes[j].f;
				}
			}
		}
		if(maxInd!=-1){
			dfsVisit(transp[maxInd],transp);
			for(j=0;j<transp.length;j=j+1){
				if(transp[j].color==2){
					transp[j].color=3;
					nodes[j].scc=count;
				}
			}
			count = count + 1;
		}else{
			cont = false;
		}
		if(count>10){
			cont=false;
		}
	}
	drawNodes();
}

function runDFSNode(nodes,ind){
	console.log("hey");
	hidePopup();
	DFSInit(nodes);
	dfsVisit(nodes[ind],nodes);
	for(i=0;i<nodes.length;i=i+1){
		if(nodes[i].getColor()==0){
			dfsVisit(nodes[i],nodes);
		}
	}
	showDFSOutput=true;
	drawNodes();
}

function runDFS(nodes){
	var i;
	DFSInit(nodes);
	for(i=0;i<nodes.length;i=i+1){
		if(nodes[i].getColor()==0){
			dfsVisit(nodes[i],nodes);
		}
	}
	showDFSOutput=true;
	drawNodes();
}

function dfsVisit(node,cnodes){
	node.color = 1;
	node.d = time;
	time = time + 1;
	for(i=0;i<node.neighbours.length;i=i+1){
		neighbour = cnodes[node.neighbours[i]];
		if(neighbour.getColor()==0){
			neighbour.pare = node.ind;
			dfsVisit(neighbour,cnodes);
		}
	}
	node.color = 2;
	node.f = time;
	time = time + 1;
}

function createTranspose(nodes){
	var newNodes = [];
	var i;
	for(i=0;i<nodes.length;i=i+1){
		var newNode = nodes[i].copyNoNeigh();
		newNodes.push(newNode);
	}
	for(i=0;i<nodes.length;i=i+1){
		var node = nodes[i];
		var j;
		for(j=0;j<node.neighbours.length;j=j+1){
			var currInd = node.neighbours[j];
			var neighbour = newNodes[currInd];
			neighbour.neighbours.push(i);
		}
	}
	return newNodes;
}