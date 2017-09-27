
function drawLine(){
	var gr = new jsGraphics(document.getElementById("drawCanvas"));
	var col = new jsColor("red");
	
	var pen = new jsPen(col,1);
	
	var pt1 = new jsPoint(20,30);
	var pt2 = new jsPoint(120,230);
	gr.drawLine(pen,pt1,pt2);
}

function createCircle(x,y,radius,color){
	var gr = new jsGraphics(document.getElementById("drawCanvas"));
	var col = new jsColor(color);
	var pen = new jsPen(col,3);
	var pt = new jsPoint(x,y);
	gr.drawCircle(pen,pt,radius);
}
