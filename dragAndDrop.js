window.onload = addListeners;
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

function rightClick(e){
	var offset = getPosition(document.getElementById('drawCanvas'));
	var x=e.clientX-offset.x;
	var y=e.clientY-offset.y;
	e.preventDefault();
	var ind = checkCollision(x,y);
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
	var offset = getPosition(document.getElementById('drawCanvas'));
	var x=e.clientX-offset.x;
	var y=e.clientY-offset.y;
	var collNode = checkCollision(x,y);
	checkCollisionEdge(x,y);
	document.getElementById("edgeControlPanel").style.visibility = "collapse";
	if(selectedEdge[0]!=-1){
		document.getElementById("edgeControlPanel").style.visibility = "visible";
		drawNodes();
	}
	if(collNode!=-1){
		selected = nodes[collNode];
		selectedInd = collNode;
		document.getElementById("nodeControlPanel").style.visibility="visible";
		lastX = selected.getX();
		lastY = selected.getY();
		selected.selected  = true;
		drawNodes();	
		foo = function(e){divMove(e,collNode);};
		window.addEventListener('mousemove',foo,true);
	}else{
		document.getElementById("nodeControlPanel").style.visibility="collapse";
		if(selected!=null){
			selected.selected=false;
			drawNodes();
		}
		selected = null;
	}
}

function divMove(e,ind){
	var node = nodes[ind];
	move = true;
	document.getElementById("nodeControlPanel").style.visibility="collapse";
	var offset = getPosition(document.getElementById('drawCanvas'));
	node.setLocation(e.clientX-offset.x,e.clientY-offset.y);
	/*if(checkCollisionNode(ind)!=-1){
		setTimeout(function(){popupVisible=true;},10);
		showPopupCreateEdge(e.clientX,e.clientY,ind,i);
	}*/
}

function checkCollisionNode(ind){
	var node = nodes[ind];
	for(i=0;i<nodes.length;i++){
		if(i!=ind){
			var other = nodes[i];
			var d = dist(node.getX(),node.getY(),other.getX(),other.getY());
			if(d<NODE_RADIUS*2){
				/*
				var string = "<font size=5>Create edge between nodes?</font>";
				string = string + "<br><button onClick=\"createEdge(" + ind + "," + i + ")\">Yes</button>";
				string = string + "&nbsp<button onClick=\"clearMessages(" + ind + ")\">No</button>"
				document.getElementById("messageBox").innerHTML=string;*/
				return i;
			}
		}
	}
	return -1;
}

function checkCollisionEdge(x,y){
	var fin=false;
	for(i=0;i<nodes.length && !fin;i++){
		var node1 = nodes[i];
		for(j=0;j<node1.neighbours.length && !fin;j++){
			var node2 = nodes[node1.neighbours[j]];
			var x1 = node1.x; var y1 = node1.y; var x2 = node2.x; var y2 = node2.y;
			var line = new Line(x1,y1,x2,y2);
			if(line.onLine(x,y,EDGE_WIDTH)){
				selectedEdge = [i,j];
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
	for(i=0;i<nodes.length;i++){
		var currX = nodes[i].getX();
		var currY = nodes[i].getY();
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