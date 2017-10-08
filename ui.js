function openNav() {
    document.getElementById("toolbar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
	document.getElementById("showToolBar").style.height="0";
}

function closeNav() {
    document.getElementById("toolbar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
	document.getElementById("showToolBar").style.height="25px";
} 

function disconnect(){
	window.location="logout.php";
}

function login(){
	var popup = document.getElementById("popupLogin");
	popup.classList.toggle("popupLoginShow");
	document.getElementById("hiderLogin").style.visibility = "visible";
}

function hideLogin(){
	var popup = document.getElementById("popupLogin");
	popup.classList.toggle("popupLoginShow");	
	document.getElementById("hiderLogin").style.visibility = "hidden";
}

/* Shows popup for node panel */
function showPopupNode(x,y,ind){
	console.log("hey");
	var popup = document.getElementById("messagePopup");
	popup.classList.toggle("popupShow");
	popup.style.left=x;
	popup.style.top=y;
	var string = "<input type=\"button\" value=\"Delete node\" onClick=\"removeNode(" + ind + ")\"><br>";
	if(indNodeFrom==-1){
		string = string + "<input type =\"button\" value=\"Edge from here\" onClick=\"edgeFrom(" + ind + ")\"><br>";
	}else if(indNodeFrom!=ind){
		string = string + "<input type =\"button\" value=\"Edge to here\" onClick=\"createEdge(" + indNodeFrom + "," + ind +")\"><br>";
	}
	string = string + "<input type=\"button\" value=\"Run DFS from here\" onClick=\"runDFSNode(nodes," + ind + ")\">";
	popup.innerHTML = string;
}

function showPopupEdge(x,y,ind1,ind2){
	var popup = document.getElementById("messagePopup");
	popup.classList.toggle("popupShow");
	popup.style.left=x;
	popup.style.top=y;
	var string = "<input type=\"button\" value=\"Remove edge\" onClick=\"removeEdge(" + ind1 + "," + ind2+ ")\"><br>";
	popup.innerHTML = string;
}

function hidePopup(){
	console.log("hiding");
	var popup = document.getElementById("messagePopup");
	popupVisible = false;
	popup.classList.toggle("popupShow");
}