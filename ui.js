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

/* Shows popup for node panel */
function showPopupNode(x,y,ind){
	var popup = document.getElementById("messagePopup");
	popup.classList.toggle("popupShow");
	popup.style.left=x;
	popup.style.top=y;
	var string = "<input type=\"button\" value=\"Delete node\" onClick=\"removeNode(" + ind + ")\"><br>";
	if(indNodeFrom==-1){
		string = string + "<input type =\"button\" value=\"Edge from here\" onClick=\"edgeFrom(" + ind + ")\"><br>";
	}else{
		string = string + "<input type =\"button\" value=\"Edge to here\" onClick=\"createEdge(" + indNodeFrom + "," + ind +")\"><br>";
	}
	string = string + "<input type=\"button\" value=\"Run DFS from here\" onClick=\"runDFS(" + ind + ")\">";
	popup.innerHTML = string;
}

function hidePopup(){
	console.log("hiding");
	var popup = document.getElementById("messagePopup");
	popupVisible = false;
	popup.classList.toggle("popupHide");
}