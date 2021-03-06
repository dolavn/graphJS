var move = false;
var popupVisible=false;
var foo=function(){};
var selected=null;
var selectedInd=-1;
var selectedEdge=[-1,-1];
const EDGE_WIDTH = 3;

function addListeners(){
	document.getElementById('drawCanvas').addEventListener('mousedown',mouseDown,false);
	window.addEventListener('mouseup',mouseUp,false);
}

function getMousePos(e){
	var offset = getPosition(document.getElementById('drawCanvas'));
	var xPos=e.clientX-offset.x;
	var yPos=e.clientY-offset.y;
	return {x:xPos,y:yPos};
}

function rightClick(e){
	var pos = getMousePos(e);
	var x = pos.x;
	var y = pos.y;
	e.preventDefault();
	var ind = checkCollision(x,y);
	checkCollisionEdge(x,y);
	if(selectedEdge[0]!=-1){
		setTimeout(function(){popupVisible=true;},30);
		showPopupEdge(e.clientX,e.clientY,selectedEdge[0],selectedEdge[1]);
	}
	if(ind!=-1){
		setTimeout(function(){popupVisible=true;},30);
		showPopupNode(e.clientX,e.clientY,ind);
	}
	
	return false;
}

function mouseUp(){
	if(move){
		move=false;
		if(selected!=null){
			selected.selected=false;
			selected = null;
			selectedInd = -1;
			drawNodes();
		}
	}
	window.removeEventListener('mousemove', foo,true);
}

function mouseDown(e){
	if(popupVisible){
		hidePopup(-1);
	}
	var pos = getMousePos(e);
	var x = pos.x;
	var y = pos.y;
	var collNode = checkCollision(x,y);
	checkCollisionEdge(x,y);
	if(selectedEdge[0]!=-1){
		drawNodes();
	}
	if(collNode!=-1){
		selected = currGraph.getNode(collNode);
		selectedInd = collNode;
		lastX = selected.getX();
		lastY = selected.getY();
		selected.selected  = true;
		drawNodes();	
		foo = function(e){divMove(e,collNode);};
		window.addEventListener('mousemove',foo,true);
	}else{
		if(selected!=null){
			selected.selected=false;
			drawNodes();
		}
		selected = null;
	}
}

function divMove(e,ind){
	var node = currGraph.getNode(ind);
	move = true;
	var offset = getPosition(document.getElementById('drawCanvas'));
	node.setLocation(e.clientX-offset.x,e.clientY-offset.y);
}

function checkCollisionNode(ind){
	var node = currGraph.getNode(ind);
	for(i=0;i<nodes.length;i++){
		if(i!=ind){
			var other = nodes[i];
			var d = dist(node.getX(),node.getY(),other.getX(),other.getY());
			if(d<NODE_RADIUS*2){
				return i;
			}
		}
	}
	return -1;
}

function checkCollisionEdge(x,y){
	var fin=false;
	for(i=0;i<currGraph.getNodesNum() && !fin;i++){
		var node1 = currGraph.getNode(i);
		for(j=0;j<node1.getNeighboursNum() && !fin;j++){
			var node2 = currGraph.getNode(node1.getNeighbour(j));
			var x1 = node1.x; var y1 = node1.y; var x2 = node2.x; var y2 = node2.y;
			var line = new Line(x1,y1,x2,y2);
			if(line.onLine(x,y,EDGE_WIDTH)){
				selectedEdge = [i,node1.getNeighbour(j)];
				fin = true;
			}
		}
	}
	if(!fin){
		var prior = selectedEdge[0]; //selectedEdge[0] before the click.
		selectedEdge = [-1,-1];
		if(prior!=-1){
			drawNodes();
		}
	}
}

function checkCollision(x,y){
	var ans = -1;
	for(i=0;i<currGraph.getNodesNum();i++){
		var currX = currGraph.getNode(i).getX();
		var currY = currGraph.getNode(i).getY();
		if(dist(x,y,currX,currY)<NODE_RADIUS){
			ans = i;
		}
	}
	return ans;
}

function dist(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
      var yScrollPos = el.scrollTop || document.documentElement.scrollTop;
 
      xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
      yPosition += (el.offsetTop - yScrollPos + el.clientTop);
    } else {
      xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}