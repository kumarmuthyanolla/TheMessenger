var messages = [];
var presentUser = {};
var Details = [];
var myapp = angular
    .module("mymodule", ["ngRoute"])
    .config(function($routeProvider) {
        $routeProvider
            .when("/Main", {
                templateUrl: "./Main.html",
                controller:"myCtrl"
            })
            .when("/loginindex", {
                templateUrl: "./loginindex.html",
                controller:"LoginController"
            })
            .when("/profile", {
                templateUrl: "./profile.html",
                controller: "profileController"
            })
            .when("/messages", {
                templateUrl: "./messages.html",
                controller: "MessagesController"
            })
            .when("/Signup", {
                templateUrl: "./Signup.html",
                controller: "SignupController"
            })
            .when("/Logout", {
                templateUrl: "./loginindex.html",
                controller: "LoginController"
            })
    })
    //update profile
    .controller('myCtrl', function($scope, $rootScope, $http) {
        $http.get("Data.json").then(function(response) {
            Details = response.data;
            localStorage.setItem("Data", JSON.stringify(Details))
        });
        
        //if(localStorage.getItem("Message")===null){
            $http.get("messages.json").then(function(response) {
                messages = response.data;
                $rootScope.mymessage = messages;
                
                localStorage.setItem("Message", JSON.stringify(messages))
            });
        //}else{
        //    $rootScope.mymessage = localStorage.getItem("Message");
        //}

    })
    .controller("profileController", function($scope, $rootScope, $location) {
        $scope.profileinfo = false;
        $scope.editProfile = true;
        $scope.edit = function() {
            $scope.profileinfo = true;
            $scope.editProfile = false;
        }
        /*************prefilling the existing fields******************/
        $scope.user = presentUser.Username;
        $scope.psswrd = presentUser.Password;
        $scope.frstname = presentUser.Firstname;
        $scope.lstname = presentUser.Lastname;
        $scope.email = presentUser.Email;
        $scope.phone = presentUser.Phone;
        $scope.loc = presentUser.Location;
        $scope.update = function() /*function to update fileds*/ {
            /***********updating info of present user*******/
            presentUser.Username = $scope.user;
            presentUser.Password = $scope.psswrd;
            presentUser.Firstname = $scope.frstname;
            presentUser.Lastname = $scope.lstname;
            presentUser.Email = $scope.email;
            presentUser.Phone = $scope.phone;
            presentUser.Location = $scope.loc;
            /***********Storing updated info in a obj*******/
            var obj = {
                "Username": presentUser.Username,
                "Password": presentUser.Password,
                "Firstname": presentUser.Firstname,
                "Lastname": presentUser.Lastname,
                "Email": presentUser.Email,
                "Location": presentUser.Location,
                "Phone": presentUser.Phone
            }

            /***********Replacing the array object with updated one*******/
            Details.splice($rootScope.currentUser, 1, obj);
            localStorage.setItem("Data", JSON.stringify(Details));
        }

        $scope.cancel = function() {
            $location.url('/profile.html');
        }

    })
    .controller("MessagesController", function($scope, $http,$rootScope) {
        
        // **************************************************************
            $rootScope.filteredArray = messages;
        
        
        $scope.MsgDelete = function(x) {
            //$rootScope.mymessage.splice(x, 1);
            $rootScope.filteredArray.splice(x, 1);
            
            localStorage.setItem("Message", JSON.stringify($rootScope.mymessage));
        }
        //$scope.mymessage = messages;
        /******for show more button************/
        $scope.custom = false;
        $scope.more = function() {
            $scope.custom = true;
        }
        /******for show more button************/
        /******for Mark as important button************/
        $scope.image = false;
        $scope.SetImportant = function() {
            $scope.image = true;
        }
        /******for Mark as important button************/
        /******for Reply button************/
        $scope.reply = false;
        $scope.Reply = function(x) {
            $scope.reply = true;
            $scope.toperson = $scope.mymessage[x].sender;
            $scope.replySubject = $scope.mymessage[x].title;
        }
        /******for send button************/
        $scope.Send = function(x,a,b,c) {
            var msg = {
                "recipient": a,
                "sender": presentUser.Username,
                "title": b,
                "description": c,
                "important": 1
            }
            messages.push(msg);
            console.log("this is msgs");
            console.log(messages);
            $scope.reply = false;
            localStorage.setItem("Message", JSON.stringify(messages));
            
            
            // **************************************************************
            $rootScope.filteredArray = messages;
            console.log("to:" + a + " ,b: " + b + " ,c:" + c);
            
        }
        /******for send button************/

    })
    .controller("LogoutController", function($scope) {})
    // Signup form
    .controller("SignupController", function($rootScope, $scope, $location) {
        $scope.loginScreen = false;
        $scope.register = function() {
            var user_name = $scope.userName;
            var pass_word = $scope.passWord;
            var first_Name = $scope.firstName;
            var last_Name = $scope.lastName;
            var mail = $scope.email;
            var mobile = $scope.phone;
            var loc = $scope.location;
            var obj = {
                "Username": user_name,
                "Password": pass_word,
                "Firstname": first_Name,
                "Lastname": last_Name,
                "Email": mail,
                "Location": loc,
                "Phone": mobile
            }
            if (obj.Username == undefined)
            {
                alert("Enter complete details");
            }
            else 
            {
                ///////////////////Details.push(obj);
                $rootScope.Details_1.push(obj);
                
                alert("User Signed Up");
                localStorage.setItem("Data", JSON.stringify(Details));
                $location.url('/Main.html');
            }
            console.log(Details);
        }
        $scope.cancel = function() {
            $location.url('/Main.html');
        }
    })
    //Login Controller
    .controller("LoginController", function($scope, $rootScope, $location,filterFilter) {
        $rootScope.contents = false;
        $scope.validate = function() {
            var user_name = $scope.Username;
            var password = $scope.Password;
            for (i = 0; i < Details.length; i++) {
                if (Details[i].Username == user_name) 
                {
                    if (Details[i].Password == password)
                    {
                        $rootScope.contents = true;
                        $location.url('/profile');
                        presentUser = Details[i];
                        $rootScope.currentUser = i;
                        $rootScope.filteredArray = filterFilter($rootScope.mymessage, {recipient:presentUser.Username});
                        console.log($rootScope.filteredArray);
                        //$scope.message = "User not found";
                        //alert($scope.message);
                        return;
                    }
                    else {
                        $scope.message = "User found but password didnt match";
                        alert($scope.message);
                        return;
                    }
                    
                }
                else
                    {
                        $scope.message = "User not found";
                        alert($scope.message);
                        return;
                    }
            }
            
        }
    })