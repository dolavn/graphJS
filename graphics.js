
function drawLine(x1,y1,x2,y2){
	var gr = new jsGraphics(document.getElementById("drawCanvas"));
	var col = new jsColor("black");
	
	var pen = new jsPen(col,3);
	
	var pt1 = new jsPoint(x1,y1);
	var pt2 = new jsPoint(x2,y2);
	gr.drawLine(pen,pt1,pt2);
}

function createCircle(x,y,radius,color){
	var gr = new jsGraphics(document.getElementById("drawCanvas"));
	var col = new jsColor(color);
	var pen = new jsPen(col,3);
	var pt = new jsPoint(x,y);
	gr.drawCircle(pen,pt,radius);
}
