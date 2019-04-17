"use strict"
const HOME_HTML = $(`<div class="panel panel-default">
    						<div class="panel-heading">Welcome to Home!</div>
    						<div class="panel-body"><strong>You are logged in.</strong>
    							<p>You won't be able to access the home and account pages if you are not logged in.</p>
    						</div>
  						</div>`);

const LOGIN_HTML = $(`<h2>Login</h2>
							<form id="loginForm">
  								<div class="form-group">
    								<label for="email">Email address:</label>
    								<input type="email" class="form-control" id="email" placeholder="Enter email">
  								</div>
  								<div class="form-group">
    								<label for="pwd">Password:</label>
    								<input type="password" class="form-control" id="password" placeholder="Password">
  								</div>
  								<button type="submit" id="submitBtn" class="btn btn-default">Login</button>
							</form>`);

let LOGGED_IN = false;

$(document).ready(function(){

	$('#content').empty().append(LOGIN_HTML);

	$('#home').on('click', function(){
		if (LOGGED_IN) {
			goToHome();
			toggleActiveMenuItem(this);
		}else{
			displayLoginMsg("Please login to access the home page.", false);
		}
	});
	$('#account').on('click', function(){
		if (LOGGED_IN) {
			$("#loginMsg").addClass("hidden");
			goToAccount();
			toggleActiveMenuItem(this);
		}else{
			displayLoginMsg("Please login to access the account page.", false);
		}
	});

	$('#login').on('click', function(event){
		if (LOGGED_IN) {
			LOGGED_IN = false;
			toggleActiveMenuItem(this);
			logOut();
		}
		  event.preventDefault();
	});

function logOut(){
	toggle_login_logout_text("login");
	$('#content').empty().append(LOGIN_HTML);
	displayLoginMsg("You are logged out.", true);
	clearForm();
}
function goToHome(){
	$("#content").empty().append(HOME_HTML);
}
function goToAccount(){
	const url = "https://jsonplaceholder.typicode.com/users/1";
	fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
  	let firstName = data.name.split(' ')[0];
  	let absoluteWebsiteUrl = "";
  	if (data.website.includes("http")) {
  		absoluteWebsiteUrl = data.website;
  	} else{
  		absoluteWebsiteUrl = "http://"+data.website;
  	}
  	const ACCOUNT_HTML = $(`<div class="row">
  								<div class="col-sm-12">
  									<h1>Hi ${firstName}!</h1>
  									<p>Welcome to your account!</p>
  								</div>
  							</div>
  							<div class="row">
  							<h3>Account Details</h3>
  								
  								<div class="col-sm-6 details" id="account_details_left">
  									<ul>
  									<li><strong>Full Name: </strong> ${data.name}</li>
  									<li><strong>username: </strong> ${data.username}</li>
  									<li><strong>Email: </strong> ${data.email}</li>
  									<li><strong>Address: </strong> ${data.address.street +' '+ data.address.suite+' , '+ data.address.city+' '+data.address.zipcode}</li>
  									<li><strong>Phone: </strong> ${data.phone}</li>
  									<li><strong>Website: </strong> <a href="${absoluteWebsiteUrl}"> ${data.website} </a></li>
  									</ul>
  								</div>
  								<div class="col-sm-6 details">
  								<ul>
  									<li><strong>Company name: </strong> ${data.company.name}</li>
  									<li><strong>CatchPhrase: </strong>${data.company.catchPhrase}</li>
  									<li><strong>Business statement: </strong>${data.company.bs}</li>
  								</ul>
  								</div>
  							</div>`);
  	$('#content').empty().append(ACCOUNT_HTML);
  });
}
$(document).on('submit', "#loginForm",function(event) {
   const email = $("#email").val();
	const password = $("#password").val();

	if(email == "sincere@april.biz" && password == "pass"){
		$("#loginMsg").addClass("hidden");
		$("#loginMsg").removeClass("loginMsgFail");	
		LOGGED_IN = true;
		goToHome();
		displayLoginMsg("Successfull login.", true);
		toggle_login_logout_text("logout");
		toggleActiveMenuItem($('#home'));
	}else{
		displayLoginMsg("Login failed. Email or password is incorrect.", false);
	}	
	event.preventDefault(); //prevent the browser from refreshing page on submit
})

function displayLoginMsg(message, success){

	$("#loginMsg").removeClass("hidden");
	if (success) {
		$("#loginMsg").removeClass("loginMsgFail");
		$("#loginMsg").addClass("loginMsgSuccess");
	}else{
		$("#loginMsg").removeClass("loginMsgSuccess");
		$("#loginMsg").addClass("loginMsgFail");
	}
	$("#loginMsg").text(message);
}

function toggleActiveMenuItem(item){
	$('.navbar-nav > li.active').removeClass('active');
	$(item).addClass('active');
}

function toggle_login_logout_text(textChange){
	$("#login > a").text(textChange);
}
function clearForm(){
	$('input').val('');
}
});

