"use strict"
//CONTENT TO BE LOADED IN THE HOME PAGE
const HOME_HTML = $(`<div class="panel panel-default" id="homePanel">
    						<div class="panel-heading">Welcome to Home!</div>
    						<div class="panel-body"><strong>You are logged in.</strong>
    							<p>You won't be able to access the home and account pages if you are not logged in.</p>
    						</div>
  						</div>`);
//CONTENT TO BE LOADED IN THE LOGIN PAGE
const LOGIN_HTML = $(`<div class="container" id="loginContainer">
							<h2>Login</h2>
							<form id="loginForm">
  								<div class="form-group">
    								<label for="email">Email address:</label>
    								<input type="email" class="form-control" id="email" placeholder="Enter email">
  								</div>
  								<div class="form-group">
    								<label for="pwd">Password:</label>
    								<input type="password" class="form-control" id="password" placeholder="Password">
  								</div>
  								<button type="submit" id="submitBtn" class="btn btn-primary">Login</button>
							</form>
						</div>`);
//@LOGGED_IN a flag that keeps track of the user's login status
let LOGGED_IN = false;
$(document).ready(function() {
	//load login page when page firts loads/refreshes
	$('#content').empty().append(LOGIN_HTML);
	//home nav item item click listener 
	$('#home').on('click', function() {
		if (LOGGED_IN) {
			goToHome();
			toggleActiveMenuItem(this);
		} else {
			displayLoginMsg("Please login to access the home page.", false);
		}
	});
	//account nav item item click listener
	$('#account').on('click', function() {
		if (LOGGED_IN) {
			$("#loginMsg").addClass("hidden");
			goToAccount();
			toggleActiveMenuItem(this);
		} else {
			displayLoginMsg("Please login to access the account page.", false);
		}
	});
	//login nav item item click listener
	$('#login').on('click', function(event) {
		if (LOGGED_IN) {
			LOGGED_IN = false;
			toggleActiveMenuItem(this);
			logOut();
		}
		event.preventDefault(); //prevents the page from refreshing
	});
	//handles logout logic
	function logOut() {
		toggle_login_logout_text("login");
		$('#content').empty().append(LOGIN_HTML);
		displayLoginMsg("You are logged out.", true);
		clearForm();
	}
	//redirects to home page
	function goToHome() {
		$("#content").empty().append(HOME_HTML);
	}
	//consumes the api to get data user from the server and redirects to account page
	function goToAccount() {
		const url = "https://jsonplaceholder.typicode.com/users/1";
		fetch(url).then(function(response) {
			return response.json();
		}).then(function(data) {
			let firstName = data.name.split(' ')[0];
			let absoluteWebsiteUrl = "";
			if (data.website.includes("http")) {
				absoluteWebsiteUrl = data.website;
			} else {
				absoluteWebsiteUrl = "http://" + data.website;
			}
			//CONTENT DISPLAYED IN THE ACCOUNT PAGE
			const ACCOUNT_HTML = $(`<div class="row">
  								<div class="col-sm-12">
  									<h1 id="greeting">Hi ${firstName}!</h1>
  									<p>Welcome to your account!</p>
  								</div>
  							</div>
  							<div class="row text-center"><h3>Account Details</h3><hr></div>
  							<div class="row text-center">
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
  								<ul class="text-center">
  									<li><h3>${data.company.name}</h3></li>
  									<li>"${data.company.catchPhrase}"</li>
  									<li>${data.company.bs}</li>
  								</ul>
  								</div>
  							</div>`);
			$('#content').empty().append(ACCOUNT_HTML);
		});
	}
	//HANDLES THE SUBMIT FORM AND CHECKS FOR EMAIL AND PASSWORD MATCH
	$(document).on('submit', "#loginForm", function(event) {
		const email = $("#email").val();
		const password = $("#password").val();
		if (email == "sincere@april.biz" && password == "pass") {
			$("#loginMsg").addClass("hidden");
			$("#loginMsg").removeClass("loginMsgFail");
			LOGGED_IN = true;
			goToHome();
			displayLoginMsg("Successfull login.", true);
			toggle_login_logout_text("logout");
			toggleActiveMenuItem($('#home'));
		} else {
			displayLoginMsg("Login failed. Email or password is incorrect.", false);
		}
		event.preventDefault(); //prevent the browser from refreshing page on submit
	});
	/**
	@message (string) => the message to display upon login
	@success (boolean) => true for successful login/logout and false for failed login
	**/
	function displayLoginMsg(message, success) {
		$("#loginMsg").removeClass("hidden");
		if (success) {
			$("#loginMsg").removeClass("loginMsgFail");
			$("#loginMsg").addClass("loginMsgSuccess");
		} else {
			$("#loginMsg").removeClass("loginMsgSuccess");
			$("#loginMsg").addClass("loginMsgFail");
		}
		$("#loginMsg").text(message);
	}
	//@item (DOM Element) the menu item to be marked as active
	function toggleActiveMenuItem(item) {
		$('.navbar-nav > li.active').removeClass('active');
		$(item).addClass('active');
	}
	//@textChange (string) => 'login'/'logout' switches between the strings when logout item is clicked on the menu
	function toggle_login_logout_text(textChange) {
		$("#login > a").text(textChange);
	}
	//clears the input form
	function clearForm() {
		$('input').val('');
	}
});