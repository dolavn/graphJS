var navOpen=true;
const NAV_WIDTH = 250;
var canvasHeight;

var funcHideComment=function(){};
var timeOutEvent;

function setUpUI(){
	setupGraph();
	drawNodes();
	canvasHeight = $(drawCanvas).height();
	document.getElementById("nodesTableCell").style.height=canvasHeight + "px";
	var weighted = document.getElementById("weightedGraph");
	if(weighted!=null){
		weighted.checked = false;
	}
	addListeners();
	var heap = new Heap(function(elem1,elem2){if(elem1>elem2){return 1;}if(elem2>elem1){return-1;}return 0;});
	heap.insert(5);heap.insert(7);heap.insert(14);heap.insert(12);heap.insert(32);
	/*while(heap.arr.length>0){
		console.log(heap.removeMin());
	}*/
	console.log(heap.arr);
}

/**
	Hides the nodes control panel.
*/
function hideControlPanel(){
	document.getElementById("nodeControlPanel").style.visibility="collapse";
	drawNodes();
}

function showAdjMatrix(graph){
	var nodes = graph.nodes;
	var popup = document.getElementById("popupMatrix");
	popup.classList.toggle("popupLargeShow");
	var matrix = getAdjMatrix(nodes);
	var str="<table class=\"matrixTable\"><tr><td style=\"background-color:black;\"></td>";
	for(var i=0;i<matrix.length;i=i+1){
		str = str + "<td style=\"background-color:grey;\">" + i + "</td>";
	}
	str = str + "</tr>";
	for(var i=0;i<matrix.length;i=i+1){
		str = str + "<tr><td style=\"background-color:grey;\">" + i + "</td>"
		for(var j=0;j<matrix[i].length;j=j+1){
			str = str + "<td>" + matrix[i][j] + "</td>";
		}
		str = str + "</tr>";
	}
	str = str + "</table>";
	document.getElementById("matrixData").innerHTML = str;
}

function hideMatrix(){
	var popup = document.getElementById("popupMatrix");
	popup.classList.toggle("popupLargeShow");
}

function dismissComment(){
	funcHideComment();
	clearTimeout(timeOutEvent);
	timeOutEvent = null;
	funcHideComment = function(){};
}

function showComment(title,comment,height,callback,time){
	var commModal = document.getElementById("comments");
	commModal.style.height=height + "px";
	document.getElementById("commentsBody").style.height=(height-80) + "px";
	commModal.classList.toggle("commentsModalShow");
	document.getElementById("titleComment").innerHTML = title;
	document.getElementById("textComment").innerHTML = comment;
	funcHideComment = function(){hideComment(callback);};
	timeOutEvent = setTimeout(funcHideComment,time);
}

function hideComment(callback){
	var commModal = document.getElementById("comments");
	commModal.classList.toggle("commentsModalShow");
	callback();
}

function openAdditionalInfo(){
	var info = document.getElementById("additInfo");
	var width = $(nodesTableCell).width();
	info.style.visibility = "visible";
	info.style.width = width + "px";
	info.style.left = ($(document).width()-width) + "px";
}

function dismissAdditInfo(){
	DFSInit(nodes);
	showDFSOutput=false;
	showBFSOutput=false;
	drawNodes();
	var info = document.getElementById("additInfo");
	info.style.left = ($(document).width());
	info.style.width = "0";
	info.style.visibility = "hidden";
	
}

function openNav() {
    document.getElementById("toolbar").style.width = NAV_WIDTH + "px";
    document.getElementById("main").style.marginLeft = NAV_WIDTH + "px";
	document.getElementById("showToolBar").style.height="0";
	navOpen = true;
	drawNodes();
}

function closeNav() {
    document.getElementById("toolbar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
	document.getElementById("showToolBar").style.height="25px";
	navOpen = false;
	drawNodes();
}

function disconnect(){
	window.location="logout.php";
}

function openNamePopup(){
	var popup = document.getElementById("popupName");
	popup.classList.toggle("popupLargeShow");
	document.getElementById("hiderName").style.visibility = "visible";		
}

function hideGraphName(){
	var popup = document.getElementById("popupName");
	popup.classList.toggle("popupLargeShow");
	document.getElementById("hiderName").style.visibility = "hidden";		
}


function openLoadGraph(){
	var popup = document.getElementById("popupGraph");
	popup.classList.toggle("popupLargeShow");
	document.getElementById("hiderLoadGraph").style.visibility = "visible";
}

function hideLoadGraph(){
	var popup = document.getElementById("popupGraph");
	popup.classList.toggle("popupLargeShow");
	document.getElementById("hiderLoadGraph").style.visibility = "hidden";
}

function login(){
	var popup = document.getElementById("popupLogin");
	popup.classList.toggle("popupLargeShow");
	document.getElementById("hiderLogin").style.visibility = "visible";
}

function hideLogin(){
	var popup = document.getElementById("popupLogin");
	popup.classList.toggle("popupLargeShow");	
	document.getElementById("hiderLogin").style.visibility = "hidden";
}

function showPopupNodeMessage(ind,message,delay,callback){
	var node = currGraph.getNode(ind);
	var x = node.x;
	var y = node.y;
	var pos = $(drawCanvas).position();
	x = x + pos.left;
	y = y + pos.top;
	var popup = document.getElementById("messagePopup");
	popup.classList.toggle("popupShow");
	popup.style.left=x;
	popup.style.top=y;
	popup.style.width="300px";
	popup.innerHTML = message;
	setTimeout(function(){hidePopup();callback()},delay);
}

/* Shows popup for node panel */
function showPopupNode(x,y,ind){
	var popup = document.getElementById("messagePopup");
	popup.classList.toggle("popupShow");
	popup.style.left=x;
	popup.style.top=y;
	popup.style.width = "200px";
	var string = "<input type=\"button\" value=\"Delete node\" onClick=\"removeNode(" + ind + ")\"><br>";
	if(indNodeFrom==-1){
		string = string + "<input type =\"button\" value=\"Edge from here\" onClick=\"edgeFrom(" + ind + ")\"><br>";
	}else if(indNodeFrom!=ind){
		string = string + "<input type =\"button\" value=\"Edge to here\" onClick=\"createEdge(" + indNodeFrom + "," + ind +")\"><br>";
	}
	string = string + "<input type=\"button\" value=\"Run DFS from here\" onClick=\"runDFSVisFromNode(currGraph.nodes," + ind + ")\"><br>";
	string = string + "<input type=\"button\" value=\"Run BFS from here\" onClick=\"runBFSVisFromNode(currGraph.nodes," + ind + ")\">";
	popup.innerHTML = string;
}

function setWeight(nodeInd1,nodeInd2){
	weightText = document.getElementById("newWeight").value;
	if(!isNaN(weightText)){
		var weight = parseInt(weightText);
		currGraph.getNode(nodeInd1).setWeight(nodeInd2,weight);
		hidePopup();
		drawNodes();
	}else{
		document.getElementById("errorText").innerHTML = "Must enter an integer!";
	}
}

function showPopupEdge(x,y,ind1,ind2){
	var popup = document.getElementById("messagePopup");
	popup.classList.toggle("popupShow");
	popup.style.left=x;
	popup.style.top=y;
	popup.style.width = "200px";
	var string = "<input type=\"button\" value=\"Remove edge\" onClick=\"removeEdge(" + ind1 + "," + ind2+ ")\"><br>";
	if(currGraph.weighted){
		string = string + "Set weight:<input type=\"text\" value=\"" + currGraph.getNode(ind1).getWeight(ind2) +"\" id=\"newWeight\">";
		string = string + "<div style=\"font-size:10px;color:white\" id=\"errorText\"></div>";
		string = string + "<input type=\"button\" value=\"Set\" onClick=\"setWeight(" + ind1 + "," + ind2 + ")\">";
	}
	popup.innerHTML = string;
}

function hidePopup(){
	var popup = document.getElementById("messagePopup");
	popupVisible = false;
	popup.classList.toggle("popupShow");
}
