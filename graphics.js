var init=false; //True if the graphics object was already initialized.
var canvases = [];
const ARROW_ANGLE=Math.PI/6; //The angle of an arrow
const BIG_ARROW=20;
const SMALL_ARROW=10;

/**
	Returns the graphics objet belonging to a given canvas.
	
	@param canvas The given canvas
	@return The graphics object belonging to this canvas.
*/
function getGraphics(canvas){
	var k;
	for(k=0;k<canvases.length;k=k+1){
		if(canvas==canvases[k][0]){
			return canvases[k][1];
		}
	}
	gr = new jsGraphics(canvas);
	currArr = [canvas,gr];
	canvases.push(currArr);
	return gr;
}

/**
	Clears the canvas
	
	@param canvas The divobject to be cleared.
*/
function clearCanvas(canvas){
	gr = getGraphics(canvas);
	gr.clear();
}

/**
	Draws a string to the screen.
	
	@param x1 The x coordinate of the string.
	@param y1 The y coordinate of the string.
	@param txt The string to be drawn.
	@param color The color of the text.
	@param size The size of the text.
	@param canvas The divobject on which to draw the text.
*/
function drawText(x1,y1,txt,color,size,canvas){
	gr = getGraphics(canvas);
	var col = new jsColor(color);
	var font = new jsFont("Arial","normal",size + "px","normal","normal");
	var point = new jsPoint(x1,y1);
	gr.drawText(txt,point,font,col,2,"center");
}

/**
	Draws a line between two points in the screen.
	
	@param x1 The first x coordinate
	@param y1 The first y coordinate
	@param x2 The second x coordinate
	@param y2 The second y coordinate
	@param canvas The divobject on which to draw the line.
*/
function drawLine(x1,y1,x2,y2,color,canvas){
	gr = getGraphics(canvas);
	var col = new jsColor(color);
	
	var pen = new jsPen(col,3);
	
	var pt1 = new jsPoint(x1,y1);
	var pt2 = new jsPoint(x2,y2);
	gr.drawLine(pen,pt1,pt2);
}

/**
	Fills a circle in the screen.
	
	@param x1 The x coordinate of the circle's center
	@param y1 The y coordinate of the circle's center
	@param radius The radius of the circle
	@param color The color of the circle
	@param canvas The divobject on which to fill the circle.
*/
function fillCircle(x1,y1,radius,color,canvas){
	gr = getGraphics(canvas);
	var col = new jsColor(color);
	var pt = new jsPoint(x1,y1);
	gr.fillCircle(col,pt,radius);
}

/**
	Draws a circle to the screen.
	
	@param x1 The x coordinate of the circle's center.
	@param y1 The y coordinate of the circle's center.
	@param radius The radius of the circle.
	@param color The color of the circle.
	@param canvas The divobject on which to fill the circle.
*/
function drawCircle(x1,y1,radius,color,canvas){
	gr = getGraphics(canvas);
	var col = new jsColor(color);
	var pen = new jsPen(col,3);
	var pt = new jsPoint(x1,y1);
	gr.drawCircle(pen,pt,radius);
}

/**
	Returns the angle a specific line makes with the positive direction of the x axis.
	
	@param x1 The first x coordinate.
	@param y1 The first y coordinate.
	@param x2 The second x coordinate.
	@param y2 The second y coordinate.
	@return the angle the line from (x1,y1) to (x2,y2) makes with the positive direction of the x axis.
*/
function getAngle(x1,y1,x2,y2){
	var dy = y2-y1;
	var dx = x2-x1;
	var y = Math.abs(dy);
	var x = Math.abs(dx);
	var ans = Math.atan(dy/dx);
	ans = ans + Math.PI/2; 
	return ans;
}

/**
	Given a line between the points (x1,y1) and (x2,y2), and a distance d,
	this function returns a point (x,y) on the line, whose distance from (x2,y2) is d.
	
	@param x1 The first x coordinate.
	@param y1 The first y coordinate.
	@param x2 The second x coordinate.
	@param y2 The second y coordinate.
	@param d The distance.
	@return The point (x,y) as defined in this function's description.
*/
function getCorrPoint(x1,y1,x2,y2,d){
	var m = getSlope(x1,y1,x2,y2);
	if(m==Number.POSITIVE_INFINITY){ //This is an horizental line.
		if(y2>y1){ //y2 is above y1
			return {"x":x2,"y":y2-d};
		}else{ //y2 is under y1
			return {"x":x2,"y":y2+d};
		}
	}else{ //This isn't an horizental line.
		var x =0;
		if(x2>x1){ //x2 is to the right of x1
			x = x2-(d/Math.sqrt(1+Math.pow(m,2)));
		}else{ //x2 is to the left of x1
			x = x2+(d/Math.sqrt(1+Math.pow(m,2)));
		}
		var y = m*(x-x2)+y2;
		return {"x":x,"y":y};
	}
}

/**
	Returns the slope of the line that goes from (x1,y1) to (x2,y2).
	
	@param x1 The first x coordinate
	@param y1 The first y coordinate
	@param x2 The second x coordinate
	@param y2 The second y coordinate
	@return Returns the slope of the line that goes from (x1,y1) to (x2,y2).
*/
function getSlope(x1,y1,x2,y2){
	if(x2!=x1){
		return (y2-y1)/(x2-x1);
	}else{
		return Number.POSITIVE_INFINITY;
	}
}

/**
	Draws a line from point (x1,y1) to point (x2,y2), while offseting
	the beginning and end point of the line by a given radius.
	
	@param x1 The first x coordinate
	@param y1 The first y coordainte
	@param x2 The second x coordinate
	@param y2 The second y coordinate
	@param color The line's color
	@param radius The offset radius
	@param canvas The canvas on which to draw
*/
function drawLineCorr(x1,y1,x2,y2,color,radius,canvas){
	var point = getCorrPoint(x1,y1,x2,y2,radius); //Corrects the end point of the the line to be on the edge of the node.
	x2 = point['x'];
	y2 = point['y'];
	point = getCorrPoint(x2,y2,x1,y1,radius); //Corrects the start point of the line to be on the edge of the node.
	x1 = point['x'];
	y1 = point['y'];
	drawLine(x1,y1,x2,y2,color,canvas);
}

/**
	Draws an arrow from point (x1,y1) to point (x2,y2).
	
	@param x1 The first x coordinate
	@param y1 The first y coordainte
	@param x2 The second x coordinate
	@param y2 The second y coordinate
	@param color The color of the arrow
	@param dist The length of the arrow's head
	@param radius The offset of each end of the arrow
	@param canvas The divobject on which to fill the circle.
*/
function drawArrow(x1,y1,x2,y2,color,dist,radius,canvas){
	var a = getAngle(x1,y1,x2,y2); //Gets the angle the line makes with the positive direction of the x axis.
	var triangle1Ang=0;
	var triangle2Ang=0;
	var coeff=1;
	if(a>=0 && a<Math.PI/2){ //A is an acute angle.
		a = a-Math.PI/2;
		triangle1Ang = a-ARROW_ANGLE;
		triangle2Ang = Math.PI/2-a - ARROW_ANGLE;
		coeff=-1;
		if(x1>x2){
			coeff=1;
		}
	}
	if(a>=Math.PI/2 && a<Math.PI){ //A is an obtuse angle
		triangle1Ang = a + ARROW_ANGLE - Math.PI/2;
		triangle2Ang = Math.PI - a +ARROW_ANGLE;
		if(x2>x1){
			coeff=-1;
		}
	}
	var point = getCorrPoint(x1,y1,x2,y2,radius); //Corrects the end point of the the arrow to be on the edge of the node.
	x2 = point['x'];
	y2 = point['y'];
	point = getCorrPoint(x2,y2,x1,y1,radius); //Corrects the start point of the arrow to be on the edge of the node.
	x1 = point['x'];
	y1 = point['y'];
	/*
	dx1 and dx2 are the differences on the x axis betweeen the line's end point and the arrow head end points.
	dy1 and dy2 are the same but on the y axis.
	*/
	var dx1 = Math.cos(triangle1Ang)*dist*coeff; 
	var dy1 = Math.sin(triangle1Ang)*dist*coeff;
	var dx2 = Math.sin(triangle2Ang)*dist*coeff;
	var dy2 = Math.cos(triangle2Ang)*dist*coeff;
	/*
		(nx1,ny1) is one of the arrow heads end point. (nx2,ny2) is the other.
	*/
	var nx1 = x2+dx1;
	var nx2 = x2+dx2;
	var ny1 = y2+dy1;
	var ny2 = y2+dy2;
	drawLine(x1,y1,x2,y2,color,canvas); //The main line.
	drawLine(x2,y2,nx1,ny1,color,canvas); //Draws one half of the arrow head.
	drawLine(x2,y2,nx2,ny2,color,canvas); //Draws the other half of the arrow head.
}
