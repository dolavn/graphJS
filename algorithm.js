var time=0;

function DFSInit(nodes){
	for(var i=0;i<nodes.length;i=i+1){
		var node = nodes[i];
		node.d=-1;
		node.f=-1;
		time=0;
		node.color=0;
		node.pare=-1;
	}
}

function getNodesFromMatrix(mat,nodes){
	for(var i=0;i<nodes.length;i=i+1){
		for(var j=0;j<nodes.length;j=j+1){
			if(mat[i][j]==1){
				nodes[i].addNeighbour(j);
			}
		}
	}
	return nodes;
}

function getAdjMatrix(nodes){
	var ans = [];
	for(var i=0;i<nodes.length;i=i+1){
		var matrixRow = new Array(nodes.length);
		for(var j=0;j<matrixRow.length;j=j+1){
			matrixRow[j]=0;
		}
		for(var j=0;j<nodes[i].neighbours.length;j=j+1){
			matrixRow[nodes[i].neighbours[j]]=1;
		}
		ans.push(matrixRow);
	}
	return ans;
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
			dfsVisit(maxInd,transp);
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
	hidePopup();
	DFSInit(nodes);
	dfsVisit(ind,nodes);
	for(i=0;i<nodes.length;i=i+1){
		if(nodes[i].getColor()==0){
			dfsVisit(i,nodes);
		}
	}
	showDFSOutput=true;
	drawNodes();
}

function runDFS(nodes){
	DFSInit(nodes);
	for(var i=0;i<nodes.length;i=i+1){
		if(nodes[i].getColor()==0){
			dfsVisit(i,nodes);
		}
	}
	resetColorsDFS(nodes);
}

function resetColorsDFS(nodes){
	for(var i=0;i<nodes.length;i=i+1){
		nodes[i].color = 0;
	}
}
	
function dfsVisit(ind,nodes){
	console.log("visiting" + ind);
	var node = nodes[ind];
	node.color = 1;
	node.d = time;
	time = time+1;
	for(var j=0;j<node.neighbours.length;j=j+1){
		var neighbour = nodes[node.neighbours[j]];
		if(neighbour.getColor()==0){
			dfsVisit(node.neighbours[j],nodes);
		}
	}
	node.f = time;
	time = time + 1;
	node.color = 2;
}

function complGraph(nodes){
	var newNodes = [];
	for(var i=0;i<nodes.length;i=i+1){ //O(N)
		var newNode = nodes[i].copyNoNeigh();
		newNodes.push(newNode);
	}
	var matrix = getAdjMatrix(nodes); //O(N^2)
	for(var i=0;i<matrix.length;i=i+1){
		for(var j=0;j<matrix[i].length;j=j+1){
			if(i!=j){
				matrix[i][j] = 1 - matrix[i][j];
			}
		}
	}
	newNodes = getNodesFromMatrix(matrix,newNodes); //O(N^2)
	return newNodes;
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