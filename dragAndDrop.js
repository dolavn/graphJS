window.onload = addListeners;
var move = false;
var foo=function(){};
var selected=null;

function addListeners(){
	document.getElementById('drawCanvas').addEventListener('mousedown',mouseDown,false);
	window.addEventListener('mouseup',mouseUp,false);
}

function mouseUp(){
	move=false;
	if(selected!=null){
		selected.selected=false;
		drawNodes();
	}
	window.removeEventListener('mousemove', foo,true);
}

function mouseDown(e){
	var offset = getPosition(document.getElementById('drawCanvas'));
	var x=e.clientX-offset.x;
	var y=e.clientY-offset.y;
	console.log("(" + x + " , " + y + ")");
	var collNode = checkCollision(x,y);
	if(collNode!=-1){
		selected = nodes[collNode];
		lastX = selected.getX();
		lastY = selected.getY();
		selected.selected  = true;
		drawNodes();
		foo = function(e){divMove(e,collNode);};
		move = true;
		window.addEventListener('mousemove',foo,true);
	}
}

function divMove(e,ind){
	var node = nodes[ind];
	if(move){
		var offset = getPosition(document.getElementById('drawCanvas'));
		node.setLocation(e.clientX-offset.x,e.clientY-offset.y);
		checkCollisionNode(ind);
	}
}

function checkCollisionNode(ind){
	var node = nodes[ind];
	for(i=0;i<nodes.length;i++){
		if(i!=ind){
			var other = nodes[i];
			var d = dist(node.getX(),node.getY(),other.getX(),other.getY());
			if(d<NODE_RADIUS*2){
				var string = "<font size=5>Create edge between nodes?</font>";
				string = string + "<br><button onClick=\"createEdge(" + ind + "," + i + ")\">Yes</button>";
				string = string + "&nbsp<button onClick=\"clearMessages(" + ind + ")\">No</button>"
				document.getElementById("messages").innerHTML=string;
			}
		}
	}
}

function checkCollision(x,y){
	var ans = -1;
	for(i=0;i<nodes.length;i++){
		var currX = nodes[i].getX();
		var currY = nodes[i].getY();
		if(dist(x,y,currX,currY)<NODE_RADIUS){
			console.log("curr:(" + currX + " , " + currY + ")");
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