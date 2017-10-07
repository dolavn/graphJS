
function passwordPopup(){
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
	window.addEventListener('mousedown',mousedown,true);
}

function mousedown(){
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("hide");
	window.removeEventListener('mousedown',mousedown,true);
}

function checkform(){
	document.getElementById("userError").style.visibility = "hidden";
	document.getElementById("passwordError").style.visibility = "hidden";
	document.getElementById("password2Error").style.visibility = "hidden";
	document.getElementById("firstNameError").style.visibility = "hidden";
	document.getElementById("lastNameError").style.visibility = "hidden";
	document.getElementById("emailError").style.visibility = "hidden";
	var user_name = document.getElementById("user_name");
	var password1 = document.getElementById("password");
	var password2 = document.getElementById("retype");
	var first_name = document.getElementById("first_name");
	var last_name = document.getElementById("last_name");
	var email = document.getElementById("email");
	
	validatePassword("54*");
	
	var pass=true;
	/*Checking that all the input was filled*/
	
	if(user_name.value==""){
		document.getElementById("userError").style.visibility = "visible";
		document.getElementById("userError").innerHTML = "You must enter a user name";
		pass=false;
	}
	if(password1.value==""){
		document.getElementById("passwordError").style.visibility = "visible";
		document.getElementById("passwordError").innerHTML = "You must enter a password";
		pass=false;
	}
	if(password2.value==""){
		document.getElementById("password2Error").style.visibility = "visible";
		document.getElementById("password2Error").innerHTML = "You must retype your password";
		pass=false;
	}
	if(first_name.value==""){
		document.getElementById("firstNameError").style.visibility = "visible";
		document.getElementById("firstNameError").innerHTML = "You must enter your first name";
		pass=false;
	}
	if(last_name.value==""){
		document.getElementById("lastNameError").style.visibility = "visible";
		document.getElementById("lastNameError").innerHTML = "You must enter your last name";
		pass=false;
	}
	if(email.value==""){
		document.getElementById("emailError").style.visibility = "visible";
		document.getElementById("emailError").innerHTML = "You must enter your email";
		pass=false;
	}
	
	if(!pass){return false;}
	
	/*Checking length apart from password*/
	if(user_name.value.length<4){
		document.getElementById("userError").style.visibility = "visible";
		document.getElementById("userError").innerHTML = "User name must be at least 4 characters long";
		pass=false;
	}
	
	if(first_name.value.length<2){
		document.getElementById("firstNameError").style.visibility = "visible";
		document.getElementById("firstNameError").innerHTML = "First name must be at least 2 characters long";
		pass=false;
	}
	
	if(last_name.value.length<2){
		document.getElementById("lastNameError").style.visibility = "visible";
		document.getElementById("lastNameError").innerHTML = "Last name must be at least 2 characters long";
		pass=false;
	}
	
	/*validates email*/
	if(!validateEmail(email.value)){
		document.getElementById("emailError").style.visibility = "visible";
		document.getElementById("emailError").innerHTML = "Invalid email";
		pass=false;
	}
	
	/*password validation*/
	if(password1.value.length<8){
		document.getElementById("passwordError").style.visibility = "visible";
		document.getElementById("passwordError").innerHTML = "Password must be at least 8 characters long";
		pass=false;
	}
	
	if(!validatePassword(password1.value)){
		document.getElementById("passwordError").style.visibility = "visible";
		document.getElementById("passwordError").innerHTML = "Illegal password";
		pass=false;
	}
	
	if(password1.value!=password2.value){
		document.getElementById("passwordError").style.visibility = "visible";
		document.getElementById("passwordError").innerHTML = "Passwords don't match";
		pass=false;
	}
	
	return pass;
}

function validatePassword(pass){
	var re = /^[a-zA-zא-ת0-9?!@#$%^&*()]+$/;
	return re.test(pass);
}

function validateEmail(email){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}