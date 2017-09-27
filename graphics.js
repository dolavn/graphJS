var bgColor = new jsColor("yellow");


function drawLine(){
	var gr = new jsGraphics(document.getElementById("drawCanvas"));
	var col = new jsColor("red");
	
	var pen = new jsPen(col,1);
	
	var pt1 = new jsPoint(20,30);
	var pt2 = new jsPoint(120,230);
	gr.drawLine(pen,pt1,pt2);
}

function createCircle(x,y,radius){
	var gr = new jsGraphics(document.getElementById("drawCanvas"));
	var col = new jsColor("black");
	
	var pt = new jsPoint(x,y);
	gr.fillCircle(col,pt,radius);
}

function removeCircle(x,y,radius){
	var gr = new jsGraphics(document.getElementById("drawCanvas"));
	var pt = new jsPoint(x,y);
	
	gr.fillCircle(bgColor,pt,radius);
}