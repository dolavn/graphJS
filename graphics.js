
var gr;
var init=false;
	
function initGraphics(){
	gr = new jsGraphics(document.getElementById("drawCanvas"));
	init=true;
}

function clearCanvas(){
	if(!init){
		initGraphics();
	}
	gr.clear();
}

function drawLine(x1,y1,x2,y2){
	if(!init){
		initGraphics();
	}
	var col = new jsColor("black");
	
	var pen = new jsPen(col,3);
	
	var pt1 = new jsPoint(x1,y1);
	var pt2 = new jsPoint(x2,y2);
	gr.drawLine(pen,pt1,pt2);
}

function createCircle(x,y,radius,color){
	if(!init){
		initGraphics();
	}
	var col = new jsColor(color);
	var pen = new jsPen(col,3);
	var pt = new jsPoint(x,y);
	gr.drawCircle(pen,pt,radius);
}

function drawArrow(x1,y1,x2,y2){
	var m,m1,m2;
	if(x2!=x1){
		var m = (y2-y1)/(x2-x1);
		var a = Math.sqrt(Math.pow(m,2)+1);
		var m1 = m+a;
		var m2 = m-a;
	}else{
		m1=1;
		m2=-1;
	}
	var d1 = 5;
	var d2 = Math.sqrt((Math.pow(m1,2)+1)/(Math.pow(m2,2)+1));
	var nx1 = x2+d1;
	var nx2 = x2+d2;
	var ny1 = m1*d1+y2;
	var ny2 = m2*d2+y2;
	//drawLine(x1,y1,x2,y2);
	drawLine(x2,y2,nx1,ny1);
	drawLine(x2,y2,nx2,ny2);
}
