var imageroute = window.location.origin;
var app = angular.module("TimelyModule", ["ngRoute", "datatables"]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            redirectTo: function() {
                if (sessionStorage.getItem("SessionId") == null) {
                    window.location.href = "./login.html";
                } else {
                    window.location.href = "pages/dashboard.html";
                }
            }
        })
        .when("/index.html", {
            resolve: {
                check: function() {
                    window.location.href = "./404";
                }
            }
        })
        .when("/dashboard", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/dashboard.html",
            controller: "DashboardController",
        })
        .when("/membershiptype", {
            templateUrl: "pages/membershiptype.html",
            controller: "MembershipController",
        })
        .when("/businesscategory", {
            templateUrl: "pages/businesscategory.html",
            controller: "BusinessCategoryController",
        })
        .when("/city", {
            templateUrl: "pages/city.html",
            controller: "CityController",
        })
        .when("/addcompany", {
            templateUrl: "pages/addcompany.html",
            controller: "AddCompanyController",
        })
        .when("/viewcompany", {
            templateUrl: "pages/viewcompany.html",
            controller: "AddCompanyController",
        })
        .when("/viewcustomer", {
            templateUrl: "pages/viewcustomer.html",
            controller: "ViewCustomerController",
        })
        .when("/vendor", {
            templateUrl: "pages/vendor.html",
            controller: "VendorController",
        });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })
});

app.controller('LoginController', function($scope, $http) {
    $scope.IsAdmin = false;
    $scope.errormessages = "Sign in to start your session";
    $scope.login = function() {
        var username = $scope.username;
        var password = $scope.Password;

        if (username == "admin" && password == "admin") {
            $scope.errorstyle = { color: "green" };
            $scope.errormessages = "User Authenticated Successfully";
            sessionStorage.setItem("SessionId", "123");
            sessionStorage.setItem("Username", "Administrator");
            sessionStorage.setItem("Role", "admin");

            var LoginUser = sessionStorage.getItem("SessionId");
            var LoginRole = sessionStorage.getItem("Role");
            var LoginName = sessionStorage.getItem("Username");

            if (LoginUser != null && LoginUser != undefined) {
                if (LoginRole == "Company") {
                    $scope.CompanyId = LoginUser;
                    $scope.LoginName = LoginName;
                } else {
                    $scope.IsAdmin = true;
                    $scope.LoginName = LoginName;
                }
            }

            window.location.href = "./#!/dashboard";
        } else {
            $scope.errorstyle = { color: "red" };
            $scope.errormessages = "Invalid Username or Password!";
        }
    }
});

app.directive("fileInput", function($parse) {
    return {
        link: function($scope, element, attrs) {
            element.on("change", function(event) {
                var files = event.target.files;
                $parse(attrs.fileInput).assign($scope, element[0].files);
                $scope.$apply();
            });
        }
    }
});