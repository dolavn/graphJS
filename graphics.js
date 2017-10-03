//graphics addition
var gr;
var init=false;
const ARROW_ANGLE=Math.PI/6;
	
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

function getAngle(x1,y1,x2,y2){
	var dy = y2-y1;
	var dx = x2-x1;
	var y = Math.abs(dy);
	var x = Math.abs(dx);
	var ans = Math.atan(dy/dx);
	ans = ans + Math.PI/2; 
	return ans;
}

function getCorrPoint(x1,y1,x2,y2,d){
	var m = getSlope(x1,y1,x2,y2);
	if(m==Number.POSITIVE_INFINITY){
		if(y2>y1){
			return {"x":x2,"y":y2-d};
		}else{
			return {"x":x2,"y":y2+d};
		}
	}else{
		var x =0;
		if(x2>x1){
			x = x2-(d/Math.sqrt(1+Math.pow(m,2)));
		}else{
			x = x2+(d/Math.sqrt(1+Math.pow(m,2)));
		}
		var y = m*x-m*x2+y2;
		return {"x":x,"y":y};
	}
}

function getSlope(x1,y1,x2,y2){
	if(x2!=x1){
		return (y2-y1)/(x2-x1);
	}else{
		return Number.POSITIVE_INFINITY;
	}
}

function drawArrow(x1,y1,x2,y2){
	var dist=20;
	var a = getAngle(x1,y1,x2,y2);
	var triangle1Ang=0;
	var triangle2Ang=0;
	var coeff=1;
	console.log(180*a/Math.PI);
	if(a>=0 && a<Math.PI/2){
		console.log("state 1");
		a = a-Math.PI/2;
		triangle1Ang = a-ARROW_ANGLE;
		triangle2Ang = Math.PI/2-a - ARROW_ANGLE;
		coeff=-1;
		if(x1>x2){
			coeff=1;
		}
	}
	if(a>=Math.PI/2 && a<Math.PI){
		console.log("state 2");
		triangle1Ang = a + ARROW_ANGLE - Math.PI/2;
		triangle2Ang = Math.PI - a +ARROW_ANGLE;
		if(x2>x1){
			coeff=-1;
		}
	}
	var point = getCorrPoint(x1,y1,x2,y2,NODE_RADIUS);
	x2 = point['x'];
	y2 = point['y'];
	point = getCorrPoint(x2,y2,x1,y1,NODE_RADIUS);
	x1 = point['x'];
	y1 = point['y'];
	var dx1 = Math.cos(triangle1Ang)*dist*coeff;
	var dy1 = Math.sin(triangle1Ang)*dist*coeff;
	var dx2 = Math.sin(triangle2Ang)*dist*coeff;
	var dy2 = Math.cos(triangle2Ang)*dist*coeff;
	var nx1 = x2+dx1;
	var nx2 = x2+dx2;
	var ny1 = y2+dy1;
	var ny2 = y2+dy2;
	drawLine(x1,y1,x2,y2);
	drawLine(x2,y2,nx1,ny1);
	drawLine(x2,y2,nx2,ny2);
}
