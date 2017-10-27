/**
	Creates a new graph object.
	
	@param directed 1 if this graph is directed, 0 otherwise.
	@param weighted 1 if this graph is weighted, 0 otherwise.
*/
function Graph(/*directed,weighted,name,id|nodes,directed,weighted,name,id*/){
	if(arguments.length<4 || arguments.length>5){
		throw "Illegal arguments number for constructing graph";
	}
	if(arguments.length==4){
		var directed = arguments[0];
		var weighted = arguments[1];
		var name = arguments[2];
		var id = arguments[3];
		var nodes = [];
	}
	if(arguments.length==5){
		var nodes = arguments[0];
		var directed = arguments[1];
		var weighted = arguments[2];
		var name = arguments[3];
		var id = arguments[4];
	}
	this.nodes = nodes;
	this.directed = directed;
	this.weighted = weighted;
	this.name = name;
	this.id = id;
}

Graph.prototype={
	constructor:Graph,
	/**
		Returns the number of nodes in the graph.
		
		@return The number of nodes in the graph.
	*/
	getNodesNum:function(){
		return this.nodes.length;
	},
	/**
		Sets the name of this graph.
		
		@param name The desired name of the graph
	*/
	setName:function(name){
		this.name = name;
	},
	/**
		Returns the number of edges in the graph.
		
		@return The number of edges in the graph.
	*/
	getEdgesNum:function(){
		var count=0;
		for(var i=0;i<this.nodes.length;i=i+1){
			count = count + this.nodes[i].getNeighboursNum();
		}
		if(this.directed){
			count = count/2;
		}
		return count;
	},
	/**
		Adds a new node to the graph.
		
		@param node The node to be added.
	*/
	addNode:function(node){
		this.nodes.push(node);
	},
	/**
		Removes a node from the graph
		
		@param ind The index of the node to be removed
	*/
	removeNode:function(ind){
		for(var i=0;i<this.nodes.length;i=i+1){ //This loop removes the node from the neighbour's list of all other nodes
			if(i!=ind){
				var found=false;
				for(j=0;j<this.nodes[i].getNeighboursNum() && !found;j=j+1){
					if(this.nodes[i].getNeighbour(j)==ind){
						this.nodes[i].neighbours.splice(j,1);
					}
				}
			}
		}
		this.nodes.splice(ind,1); //Removes the node from the graph
		/*
			Offsetting all the indices of the nodes whose index is greater then i by 1
		*/
		for(i=ind;i<nodes.length;i=i+1){ 
			var node = nodes[i];
			node.ind = node.ind - 1;
		}
		for(i=0;i<nodes.length;i=i+1){
			for(j=0;j<nodes[i].getNeighboursNum();j=j+1){
				if(nodes[i].getNeighbour(j)>ind){
					nodes[i].setNeighbour(j,getNeighbour(j)-1);
				}
			}
		}
	},
	/**
		Returns the node with a given index in this graph.
		
		@param ind The index of the node.
		@return The node in the given index.
	*/
	getNode:function(ind){
		return this.nodes[ind];
	}
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
		Returns the number of neighbours of this node.
		
		@return The number of neighbours of this node.
	*/
	getNeighboursNum:function(){
		return this.neighbours.length;
	},
	/**
		Returns the ind-th neighbour of this node.
		
		@param ind The index of the neighbour
	*/
	getNeighbour:function(ind){
		return this.neighbours[ind][0];
	},
	/**
		Returns the weight of the edge between this node and the node
		in index ind. Throws an exception if no such edge exists.
		
		@param ind The index of the node.
		@return The weight of the edge between this node and the node in index ind.
		@throw An exception if no such edge exists.
	*/
	getWeight:function(ind){
		var neighbourInd = this.getNeighbourInd(ind);
		return this.neighbours[neighbourInd][1];
	},
	/**
		Returns the index in this node's neighbours list of a desired node,
		throws an exception if the given node is not a neighbour of this one.
		
		@param ind A index of a node.
		@return The index in this node's neighbours list, of that node.
		@throws An exception if the given node is not a neighbour of this one.
	*/
	getNeighbourInd:function(ind){
		var neighbourInd = -1;
		for(var i=0;i<this.neighbours.length && neighbourInd==-1;i=i+1){
			if(ind==this.neighbours[i][0]){
				neighbourInd = i;
			}
		}
		if(neighbourInd==-1){
			throw "The given node is not a neighbour of this node.";
		}
		return neighbourInd;
	},
	/**
		Sets the weight of the edge between this node and the node with index ind,
		to a specific weight.
		
		@param ind The index of the other node.
		@param weight The desired weight
	*/
	setWeight:function(ind,weight){
		var neighbourInd = this.getNeighbourInd(ind);
		this.neighbours[neighbourInd][1] = weight;
	},
	/**
		Sets the ind-th neighbour of this node to be a given node.
		
		@param ind The desired index of the node.
		@param node The node which will become the neighbour.
	*/
	setNeighbour:function(ind,node){
		this.neighbours[ind]=node;
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
			if(this.getNeighbour(j)==ind){
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
	},getOffset:function(dist){
		var midX = (this.x1+this.x2)/2;
		var midY = (this.y1+this.y2)/2;
		if(this.vertical){
			return {x:(midX+dist),y:midY};
		}else{
			var ortho = -1/this.m; //The slope of a line orthogonal to this one.
			var sign = Math.sign(this.y2-this.y1); //Whether the end point of the line is below or above the starting point.
			var retX = midX - sign*dist/Math.sqrt(1+Math.pow(ortho,2));
			var retY = midY + ortho*retX - ortho*midX;
			return {x:retX,y:retY};
		}
	}
}

