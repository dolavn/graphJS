window.onload = addListeners;

function addListeners(){
	document.getElementById('movable').addEventListener('mousedown',mouseDown,false);
	window.addEventListener('mouseup',mouseUp,false);
}

function mouseUp(){
	window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(){
	window.addEventListener('mousemove',divMove,true);
}

function divMove(e){
	var div = document.getElementById('movable');
	div.style.position = 'absolute';
	div.style.top = e.clientY + 'px';
	div.style.left = e.clientX + 'px';
}