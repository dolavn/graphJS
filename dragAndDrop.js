window.onload = addListeners;
var move = false;

function addListeners(){
	document.getElementById('drawCanvas').addEventListener('mousedown',mouseDown,false);
	window.addEventListener('mouseup',mouseUp,false);
}

function mouseUp(){
	move=false;
	window.removeEventListener('mousemove', function(e){divMove(e,collNode);},true);
}

function mouseDown(e){
	var x=e.clientX-93;
	var y=e.clientY-243;
	console.log("(" + x + " , " + y + ")");
	var collNode = checkCollision(x,y);
	if(collNode!=null){
		move = true;
		window.addEventListener('mousemove',function(e){divMove(e,collNode);},true);
	}
}

function divMove(e,node){
	if(move){
		node.setLocation(e.clientX-93,e.clientY-243);
	}
	/*var div = document.getElementById('movable');
	div.style.position = 'absolute';
	div.style.top = e.clientY + 'px';
	div.style.left = e.clientX + 'px';*/
}

function checkCollision(x,y){
	var ans = null;
	for(i=0;i<nodes.length;i++){
		var currX = nodes[i].getX();
		var currY = nodes[i].getY();
		console.log("curr:(" + currX + " , " + currY + ")");
		console.log(dist(x,y,currX,currY));
		if(dist(x,y,currX,currY)<20){
			ans = nodes[i];
		}
	}
	return ans;
}

function dist(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}