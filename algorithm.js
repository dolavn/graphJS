/*
 *	This file contains many graph algoirthm.
 */

var time=0;

function dijkstraInit(nodes,srcInd){
	var dist = new Array(nodes.length);
	var prev = new Array(nodes.length);
	for(var i=0;i<dist.length;i=i+1){
		dist[i] = Number.POSITIVE_INFINITY;
		prev[i] = null;
	}
	var cmp = function(elem1,elem2){ //Function to compare between two nodes
		if(elem1.dist<elem2.dist){return 1;}
		if(elem2.dist<elem1.dist){return -1;}
		return 0;
	}
	var heap = new Heap(cmp);
	for(var i=0;i<nodes.length;i=i+1){
		heap.insert({ind:i,dist:dist[i]});
	}
	dist[srcInd]=0;
	return {dist:dist,prev:prev,heap:heap};
}

function dijkstra(nodes,srcInd){
	var dataSet = dijkstraInit(nodes,srcInd);
	var heap = dataSet.heap;
	var dist = dataSet.dist;
	var prev = dataSet.prev;
	while(!heap.isEmpty()){
		var min = heap.removeMin();
		var ind = min.ind;
		var node = nodes[ind];
		for(var i=0;i<node.getNeighboursNum();i=i+1){
			var other = node.getNeighbour(i);
			var temp = dist[ind]+node.getWeight(other);
			if(temp<dist[other]){
				
			}
		}
	}
}

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
		for(var j=0;j<nodes[i].getNeighboursNum();j=j+1){
			matrixRow[nodes[i].getNeighbour(j)]=1;
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
	var node = nodes[ind];
	node.color = 1;
	node.d = time;
	time = time+1;
	for(var j=0;j<node.getNeighboursNum();j=j+1){
		var neighbour = nodes[node.getNeighbour(j)];
		if(neighbour.getColor()==0){
			dfsVisit(node.getNeighbour(j),nodes);
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
		for(j=0;j<node.getNeighboursNum();j=j+1){
			var currInd = node.getNeighbour(j);
			var neighbour = newNodes[currInd];
			neighbour.addNeighbour(i);
		}
	}
	return newNodes;
}

/**
	Constructs a new Heap object.
	
	@param cmp A function to compare between two heap objects
*/
function Heap(cmp){
	this.arr = [];
	this.cmp = function(elem1,elem2){
		//var elemVal1 = elem1.obj; var elemVal2 = elem2.obj;
		if(elem1==elem2){return 0;}
		if(elem1==Number.POSITIVE_INFINITY || elem2==Number.NEGATIVE_INFINITY){return 1;}
		if(elem1==Number.NEGATIVE_INFINITY || elem2==Number.POSITIVE_INFINITY){return -1;}
		return cmp(elem1,elem2);
	};
}

/**
	Heap data structure, used for Dijksra algorithm.
*/
Heap.prototype={
	constructor:Heap,
	getFather:function(ind){
		return Math.floor((ind-1)/2);
	},
	getLeftSon:function(ind){
		return 2*ind+1;
	},
	getRightSon:function(ind){
		return 2*ind+2;
	},
	switchElements:function(ind1,ind2){
		var temp = this.arr[ind2];
		this.arr[ind2] = this.arr[ind1];
		this.arr[ind2].ind = ind2;
		this.arr[ind1] = temp;
		this.arr[ind1].ind = ind1;
	},
	upHeapify:function(ind){
		var currInd = ind;
		while(currInd>0 && this.cmp(this.arr[this.getFather(currInd)],this.arr[currInd])>0){
			this.switchElements(currInd,this.getFather(currInd));
			currInd = this.getFather(currInd);
		}
	},
	getElement:function(ind,oob){
		if(ind>=this.arr.length || ind<0){
			return oob;
		}else{
			return this.arr[ind];
		}
	},
	min:function(elem1,elem2){
		if(this.cmp(elem1,elem2)<0){
			return elem1;
		}else{
			return elem2;
		}
	},
	downHeapify:function(ind){
		var currInd = ind; var currElem = this.getElement(ind);
		var sonRInd = this.getRightSon(ind); var sonR = this.getElement(sonRInd,Number.POSITIVE_INFINITY);
		var sonLInd = this.getLeftSon(ind); var sonL = this.getElement(sonLInd,Number.POSITIVE_INFINITY);
		while((this.cmp(currElem,sonR)>0 || this.cmp(currElem,sonL)>0)){
			var smallest = this.min(sonR,sonL);
			var indSon = sonRInd; //The index of the smaller son initialized to be the left son
			if(this.getElement(sonLInd,Number.POSITIVE_INFINITY)==smallest){
				indSon = sonLInd; //If the right son is the smaller one, changes the index
			}
			this.switchElements(currInd,indSon);
			currInd = indSon;
			sonRInd = this.getRightSon(currInd); sonR = this.getElement(sonRInd,Number.POSITIVE_INFINITY);
			sonLInd = this.getLeftSon(currInd); sonL = this.getElement(sonLInd,Number.POSITIVE_INFINITY);
		}
	},
	removeLastElem:function(){
		this.arr.pop();
	},
	removeElem:function(ind){
		this.switchElements(ind,this.arr.length-1);
		this.removeLastElem();
		this.downHeapify(ind);
	},
	peekMin:function(){
		return this.arr[0];
	},
	removeMin:function(){
		var ans = this.arr[0];
		this.switchElements(0,this.arr.length-1);
		this.removeLastElem();
		this.downHeapify(0);
		return ans;
	},
	insert:function(obj){
		var elem = {ind:{value:(arr.length-1)},obj:obj};
		this.arr.push(elem);
		this.upHeapify(this.arr.length-1);
		return elem.ind;
	},
	changeVal:function(ind,newVal){
		this.arr[ind] = newVal;
		this.upHeapify(ind);
	},
	isEmpty:function(){
		return this.arr.length>0;
	},
	getHeapAsHTMLTable(tableClass){
		var str = "<table class=\"" + tableClass + "\">";
		for(var i=0;i<this.arr.length;i=i+1){
			str = str + "<tr><td>" + this.arr[i] + "</td></tr>";
		}
		str = str + "</table>";
		return str;
	}
}

/**
    Class queue for javascript.
    @author Dolav Nitay
 */

function Queue(){
    this.arr = [];
}

Queue.prototype={
    constructor:Queue,
    
    enqueue:function(obj){
        this.arr.push(obj);
    },
    deque:function(obj){
        var ans = this.arr.shift();
        return ans;
    },
    length:function(){
        return this.arr.length;
    },
	isEmpty:function(){
		return this.arr.length==0;
	}
}