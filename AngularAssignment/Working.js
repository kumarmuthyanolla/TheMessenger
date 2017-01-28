var messages = [];
var presentUser = {};
var Details = [];
console.log(presentUser.Username);
var myapp = angular
    .module("mymodule", ["ngRoute"])
    .config(function($routeProvider) {
        $routeProvider
            .when("/loginindex", {
                templateUrl: "./loginindex.html"
                //controller:"LoginController"
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
    })
    //update profile
    .controller('myCtrl', function($scope, $rootScope, $http) {
        console.log("In main controller");
        $http.get("Data.json").then(function(response) {
            //$scope.myWelcome = response.data;-------------------
            Details = response.data;
            console.log(Details);
            // $rootScope.arrey = $scope.myWelcome;-----------------
            //console.log($rootScope);
            //console.log($scope.myWelcome);
            // localStorage.setItem("Data", JSON.stringify($scope.myWelcome));-----------------------
            //localStorage.setItem("Data", JSON.stringify(Details));
        });
        
        //if(localStorage.getItem("Message")===null){
            $http.get("messages.json").then(function(response) {
                console.log("then after msg json load");
                messages = response.data;
                /*for (i = 0; i < messages.length; i++) {
                    var ID;
                    messages[i].ID = i;
                }*/

                //console.log(messages);
                //localStorage.setItem("Message", JSON.stringify(messages));
                //console.log("hello");
                //console.log(messages.recipient);
                $rootScope.mymessage = messages;
                //$rootScope.mymessage = $scope.mymessage = messages;
                console.log("from ctrl"+messages);
            });
        //}else{
        //    $rootScope.mymessage = localStorage.getItem("Message");
        //}

    })
    .controller("profileController", function($scope, $rootScope, $location) {
        console.log("in profile controller");
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
        /***********Finding Index of present user*******/
        var hello;
        for (var i = 0; i < Details.length; i++) {
            if (Details[i].Username == presentUser.Username) {
                hello = i;
            }
        }
        $scope.update = function() /*function to update fileds*/ {
            /***********updating info of present user*******/
            console.log("in update function");
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

            console.log(obj);
            console.log(hello);
            /***********Replacing the array object with updated one*******/
            Details.splice(hello, 1, obj);
            console.log(Details);

            localStorage.setItem("Data", JSON.stringify(Details))
            //$rootScope.arrey = Details;-------------------------
            //console.log($rootScope);-------------------------
        }

        $scope.cancel = function() {
            $location.url('/profile.html');
        }

    })
    .controller("MessagesController", function($scope, $http,$rootScope) {
        //messages=localStorage.getItem("Message");
        //$scope.mymessage = messages;



        console.log("in msg controller"); // Displays you entered msg controller
        //Getting data from Json
        

        $scope.MsgDelete = function(x) {
            console.log($scope.mymessage);
            /*var k,m;
                             k=x.ID;
                           //console.log(k);
                           
                           
                           for(i=0;i<messages.length;i++){
                               if(messages[i].ID==k)
                               {
                                     m=i;
//                                   console.log(i);
                               }
                           }*/


            // delete msg
            $rootScope.mymessage.splice(x, 1);
            //$scope.mymessage.splice(x, 1);
            //messages.splice(x, 1);
            console.log($scope.mymessage);
            localStorage.setItem("Message", JSON.stringify($rootScope.mymessage));

            //updata local storage
            //localStorage.setItem("Message", JSON.stringify(messages));

            //console.log(messages);

            // update UI
            //$scope.mymessage = messages;


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
            console.log("in reply function");
            $scope.reply = true;
            console.log($scope.mymessage[x].sender);
            $scope.toperson = $scope.mymessage[x].sender;
            $scope.replySubject = $scope.mymessage[x].title;
        }
        /******for send button************/
        $scope.send = function(x) {
            console.log("in send function");
            var msg = {
                "recipient": $scope.mymessage[x].sender,
                "sender": presentUser.Username,
                "title": $scope.mymessage[x].title,
                "description": $scope.mymessage[x].replyText,
                "important": 1
            }
            messages.push(msg);
            console.log(messages);
            localStorage.setItem("Message", JSON.stringify(messages));
        }
        /******for send button************/

    })
    .controller("LogoutController", function($scope) {})
    // Signup form
    .controller("SignupController", function($rootScope, $scope, $location) {
        console.log("in Signup controller");
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
            console.log(obj);
            if (obj.Username == undefined) {
                alert("Enter complete details");
            } else {
                Details.push(obj);
                console.log(Details);
                //$rootScope.arrey = Details;----------------------------------------
                localStorage.setItem("Data", JSON.stringify(Details));

                $location.url('/Main.html');
            }
        }
        $scope.cancel = function() {
            $location.url('/Main.html');
        }

    })
    //Login Controller
    .controller("LoginController", function($scope, $rootScope, $location) {
        $rootScope.contents = false;
        console.log("In login Controller");
        $scope.validate = function() {
            var user_name = $scope.Username;
            var password = $scope.Password;
            for (i = 0; i < Details.length; i++) {
                if (Details[i].Username == user_name) {
                    if (Details[i].Password == password) {
                        $rootScope.contents = true;
                        $location.url('/profile');
                        presentUser = Details[i];
                        return;
                    } else {
                        $scope.message = "User found but password didnt match";
                        alert($scope.message);
                        return;
                    }
                }
            }
            $scope.message = "User not found";
            alert($scope.message);
        }
    })