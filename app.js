/*const request = require('request');
const app = require('./server/api.js')*/



window.addEventListener('load', function() {
  var content = document.querySelector('.content');
  var loadingSpinner = document.getElementById('loading');
  content.style.display = 'block';
  loadingSpinner.style.display = 'none';

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    //audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid'
  });
  var email;
  var password;
  var loginStatus = document.querySelector('.container h4');
  var loginView = document.getElementById('login-view');
    var usermetadataView = document.getElementById('usermetadata-view');
  var homeView = document.getElementById('home-view');
  var PwView = document.getElementById('passwordless-view');

  // buttons and event listeners
  var homeViewBtn = document.getElementById('btn-home-view');
  var loginViewBtn = document.getElementById('btn-login-view');
  var PWViewBtn = document.getElementById('btn-passwordless-view');
  var logoutBtn = document.getElementById('btn-logout');

  var PwBtn = document.getElementById('btn-passwordless');
  var loginBtn = document.getElementById('btn-login');
  var signupBtn = document.getElementById('btn-signup');
  var signupActualBtn = document.getElementById('btn-actual-signup');
  var googleLoginBtn = document.getElementById('btn-google-login');

  var authForm = document.getElementById('auth-form');

  homeViewBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    loginView.style.display = 'none';
      usermetadataView.style.display = 'none';
  });

  loginViewBtn.addEventListener('click', function() {
    loginView.style.display = 'inline-block';
    homeView.style.display = 'none';
      PwView.style.display = 'none'
      usermetadataView.style.display = 'none';
  });

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    login(email, password);
  });

    PWViewBtn.addEventListener('click', function() {
        PwView.style.display = 'inline-block';
        homeView.style.display = 'none';
        loginView.style.display = 'none';
        usermetadataView.style.display = 'none';
    });

    PwBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var email = document.getElementById('PasswordlessEmail').value;
        var phone = document.getElementById('PasswordlessCellPhone').value;
        var code = document.getElementById('Passwordlesscode').value;

        if (email.length !=0  && code.length == 0 ) {
            passwordlessAuthEmail(email);

        }
        else if (phone.length !=0  && code.length == 0)
        {
          console.log("in else if");
          passwordlessAuthPhone(phone);
        }
        else if (code.length != 0 && email.length != 0  ){
          verifyPasswordlessCode(code,email);
        }
        else if (code.length != 0 && phone.length != 0 ){
            verifyPasswordlessCodeSMS(code,phone);
        }
        //login(email, password);
        //console.log(email, phone );
    });

  signupBtn.addEventListener('click', function() {
    email = document.getElementById('email').value;
     password = document.getElementById('password').value;
      usermetadataView.style.display ='inline-block'
      homeView.style.display = 'none';
      loginView.style.display = 'none';
      PwView.style.display = 'none';

      //additionalSignUpFields(email, password);
  });



        signupActualBtn.addEventListener('click', function (e) {

            var address1 = document.getElementById('address1').value;
            var address2 = document.getElementById('address2').value;
            var fn = document.getElementById('fn').value;
            var ln = document.getElementById('ln').value;
            var phone = document.getElementById('phone').value;
            var city = document.getElementById('city').value;
            var zip = document.getElementById('zip').value;
            var age = document.getElementById('age').value;

            signup(email, password, address1, address2, fn, ln, phone, city, zip,age);
            e.preventDefault();

        });



  logoutBtn.addEventListener('click', logout);

  googleLoginBtn.addEventListener('click', loginWithGoogle);

  function login(username, password) {
    webAuth.login(
      {
        realm: 'Username-Password-Authentication',
        username: username,
        password: password
      },

        // try adding scope.

      function(err, data) {
        if (err) {
          console.log(err);
          alert(
            'Error: ' + err.description + '. Check the console for further details.'
          );
          return;
        }
        setSession(data);
        authForm.reset();
        loginView.style.display = 'none';
        homeView.style.display = 'inline-block';
        displayButtons();
      }
    );
  }

  /*function signup(email, password) {
    webAuth.redirect.signupAndLogin(
      {
        connection: 'Username-Password-Authentication',
        email: email,
        password: password
      },
      function(err) {
        if (err) {
          console.log(err);
          alert(
            'Error: ' + err.description + '. Check the console for further details.'
          );

          return;
        }
      }
    );
  }*/

    function signup(email, password, address1, address2, fn, ln, phone, city, zip,age) {
        //debugger;
        /*var data = {client_id: '95UjTkWlB5FlwceYVvRA0L3VNImUtQY4', email: email, password: password, connection: 'Username-Password-Authentication'};
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://sumana-bioreference.auth0.com/dbconnections/signup",
            "method": "POST",
            "contentType": "application/json",
            "processData": false,
            dataType: "json",
            data: JSON.stringify(data)
        };

        $.ajax(settings).done(function (response) {
            if (response.statusCode == 400)
            console.log(response);*/
            //else if (response.statusCode ==200 ){


            var data = {email: email, password: password, connection: 'Username-Password-Authentication',
            user_metadata: {
                "address1" : address1,
                "address2" : address2,
                "FirstName" : fn,
                "Name" : fn+ln,
                "address3" : address1 + address2,
                "ln" : ln,
                "phone": phone,
                "city" : city,
                "zip" : zip,
                "zip1" : zip + '1',
                "zip2" : zip + '2',
                "age" : parseInt(age)
            }
            };
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https:/" + AUTH0_DOMAIN + "/api/v2/users",
                "method": "POST",
                "headers": {
                    "authorization": "Bearer XX",
                    "content-type": "application/json"
                },
                "processData": false,
                "data": JSON.stringify(data)
            }

            $.ajax(settings).done(function (response) {

                    console.log(response);
                    alert(response);

            });

            // } //else if

        }





    function passwordlessAuthEmail(email) {
        webAuth.passwordlessStart({
                connection: 'email',
                send: 'link',
                email: email
            }, function (err,res) {
                console.log(res);
            }
        );
    }

   function passwordlessAuthPhone(cell) {
    console.log("in function" + cell);
        webAuth.passwordlessStart({
                connection: 'sms',
                send: 'code',
                phoneNumber: cell
            }, function (err,res) {
               console.log(res);
            }
        );
    }


    /*function passwordlessAuthPhone(cell) {

        var data = {client_id: 'XX',connection: 'sms', phone_number: cell, send : 'code' ,
            authParams: {redirectUri: AUTH0_CALLBACK_URL,
            responseType: 'id_token',
            scope: 'openid'}
        };
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://<DOMAIN>.auth0.com/passwordless/start",
            "method": "POST",
            "headers": {
                 "content-type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        $.ajax(settings).done(function (response) {

            console.log(response);
            //alert(response);

        });
    }*/

    function verifyPasswordlessCode(code,email){
        webAuth.passwordlessLogin({
                connection: 'email',
                email: email,
                verificationCode: code
            }, function (err,res) {
                console.log(res);
            }
        );

    }

    function verifyPasswordlessCodeSMS(code,cell){
        webAuth.passwordlessLogin({
                connection: 'sms',
            phoneNumber: cell,
                verificationCode: code
            }, function (err,res) {
                console.log(res);
            }
        );

    }

/*
    function verifyPasswordlessCodeSMS(code, cell) {

        var data = {client_id: 'XX',connection: 'sms', grant_type: "password", username: cell, password: code,
            scope: 'openid', device: 'My Phone'}
        };
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://<DOMAIN>.auth0.com/oauth/ro",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        $.ajax(settings).done(function (response) {

            console.log(response);
            //alert(response);

        });
    }
*/

    function loginWithGoogle() {
    webAuth.authorize({
      connection: 'google-oauth2'
    });
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    displayButtons();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayButtons() {
    if (isAuthenticated()) {
      loginViewBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      loginStatus.innerHTML = 'You are logged in!';
    } else {
      loginViewBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      loginStatus.innerHTML =
        'You are not logged in! Please log in to continue.';
    }
  }

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        authForm.reset();
        loginView.style.display = 'none';
        homeView.style.display = 'inline-block';
      } else if (err) {
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
      displayButtons();
    });
  }

  handleAuthentication();
});
