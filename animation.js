function myMove(){
	var elem = document.getElementById("animation");
	var pos=0;
	var id = setInterval(frame,5);
	function frame(){
		if(pos==500){
			clearInterval(id);
		}else{
			pos++;
			elem.style.top = pos + 'px';
			elem.style.left = pos + 'px';
		}
	}
}