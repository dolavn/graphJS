/*
 *	This file contains many graph algoirthm.
 */

var time=0;

function dijkstraInit(nodes,srcInd){
	var dist = new Array(nodes.length);
	var prev = new Array(nodes.length);
	for(var i=0;i<prev.length;i=i+1){
		prev[i] = null;
	}
	var cmp = function(elem1,elem2){ //Function to compare between two nodes
		if(elem1.dist>elem2.dist){return 1;}
		if(elem2.dist>elem1.dist){return -1;}
		return 0;
	}
	//Each element in the heap consists of an index of the node, and a distance.
	var heap = new Heap(cmp); 
	for(var i=0;i<nodes.length;i=i+1){ //Creates the heap of the distances
		var currDist = Number.POSITIVE_INFINITY; //The distance of this node from the source node at initialization
		if(i == srcInd) { currDist = 0;} 
		dist[i] = heap.insert({ind:i,dist:currDist});
	}
	return {dist:dist,prev:prev,heap:heap};
}

function dijkstra(nodes,srcInd){
	/*
	Returns the index in the heap of a given node.
	*/
	function getHeapIndex(ind){
		return distInd[ind].value;
	}
	var dataSet = dijkstraInit(nodes,srcInd);
	var heap = dataSet.heap; //The heap of all the (index,distance) pairs.
	var distInd = dataSet.dist; //The map between a node index and an heap index 
	var distances = new Array(nodes.length); //An answer array,of all the distances to be returned after the algorith, finishes
	var prev = dataSet.prev; //Array of all the node's predecessors.
	while(!heap.isEmpty()){ /*As long as there are still nodes remaining */
		var min = heap.removeMin(); //Removes the node with the minimum distance
		var ind = min.ind;
		distances[ind] = min.dist; //Adds the distance to that node to the answer array
		var node = nodes[ind];
		for(var i=0;i<node.getNeighboursNum();i=i+1){ //Goes over all the nodes neighbours'
			var other = node.getNeighbour(i);
			var temp = min.dist+node.getWeight(other);
			if(temp<heap.peek(getHeapIndex(other)).dist){ //There's an improvement to the node's distance
				heap.changeVal(getHeapIndex(other),{ind:other,dist:temp});  //Updates the node's distance
				prev[other] = ind;
			}
		}
	}
	console.log(distances);
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
		this.arr[ind2].ind.value = ind2;
		this.arr[ind1] = temp;
		this.arr[ind1].ind.value = ind1;
	},
	upHeapify:function(ind){
		var currInd = ind;
		while(currInd>0 && this.cmp(this.getElement(this.getFather(currInd)),this.getElement(currInd))>0){
			this.switchElements(currInd,this.getFather(currInd));
			currInd = this.getFather(currInd);
		}
	},
	getElement:function(/*ind,oob | ind */){
		if(arguments.length==0 || arguments.length>2){ throw "Illegal number of arguments to getElement";}
		if(arguments.length==2){
			var ind = arguments[0]; var oob = arguments[1];
			if(ind>=this.arr.length || ind<0){
				return oob;
			}else{
				return this.arr[ind].obj;
			}
		}
		if(arguments.length==1){
			var ind = arguments[0];
			return this.arr[ind].obj;
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
		if(ind<0 || ind>=this.arr.length) {console.log(ind);}
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
		return this.peek(0);
	},
	removeMin:function(){
		var ans = this.arr[0].obj;
		this.switchElements(0,this.arr.length-1);
		this.removeLastElem();
		if(!this.isEmpty()){this.downHeapify(0);}
		return ans;
	},
	insert:function(obj){
		var elem = {ind:{value:(this.arr.length)},obj:obj};
		this.arr.push(elem);
		this.upHeapify(this.arr.length-1);
		return elem.ind;
	},
	changeVal:function(ind,newVal){
		this.arr[ind].obj = newVal;
		this.upHeapify(ind);
	},
	isEmpty:function(){
		return this.arr.length<=0;
	},
	peek:function(ind){
		return this.arr[ind].obj;
	},
	getHeapAsHTMLTable(tableClass){
		var str = "<table class=\"" + tableClass + "\"><tr><td>obj</td><td>ind</td>";
		for(var i=0;i<this.arr.length;i=i+1){
			str = str + "<tr><td>" + this.arr[i].obj + "</td><td>" + this.arr[i].ind.value + "</td></tr>";
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