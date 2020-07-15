var imageroute = window.location.origin;
var app = angular.module("TimelyModule", ["ngRoute", "datatables"]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            redirectTo: function() {
                if (sessionStorage.getItem("SessionId") == null) {
                    window.location.href = "./login.html";
                } else {
                    window.location.href = "/dashboard";
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
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/membershiptype.html",
            controller: "MembershipController",
        })
        .when("/businesscategory", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/businesscategory.html",
            controller: "BusinessCategoryController",
        })
        .when("/city", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/city.html",
            controller: "CityController",
        })
        .when("/addcompany", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/addcompany.html",
            controller: "AddCompanyController",
        })
        .when("/viewcompany", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/viewcompany.html",
            controller: "AddCompanyController",
        })
        .when("/viewcustomer", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/viewcustomer.html",
            controller: "ViewCustomerController",
        })
        .when("/vendor", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/vendor.html",
            controller: "VendorController",
        })
        .when("/banner", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/banner.html",
            controller: "BannerController",
        })
        .when("/addcompanyinventory", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/addcompanyinventory.html",
            controller: "AddCompanyInventoryController",
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

    $scope.companyLoginData = function() {
        window.location.href = "./companylogin.html";
    }

});

app.controller('CompanyLoginController', function($scope, $http) {
    $scope.IsAdmin = false;
    $scope.errormessages = "Sign in to start your session";

    $scope.companylogin = function() {
        var companyEmail = $scope.CompanyEmail;
        var password = $scope.Password;
        var companyCode = $scope.CompanyCode;
        var datalist = {
            adminEmail: companyEmail,
            adminPassword: password,
            role: "company",
            companyCode: companyCode
        }
        $http({
            url: imageroute + "/admin/companySignIn",
            method: "POST",
            cache: false,
            data: datalist,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                console.log(response.data);
                if (response.data.Data.length == 1) {
                    $scope.DataList = response.data.Data;
                    $scope.errorstyle = { color: "green" };
                    $scope.errormessages = "User Authenticated Successfully";
                    sessionStorage.setItem("SessionId", $scope.DataList.CompanyId);
                    sessionStorage.setItem("Username", $scope.DataList.companyName);
                    sessionStorage.setItem("Role", "company");

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
                    console.log("Internal Server");
                    $scope.IsAdmin = true;
                    $scope.LoginName = LoginName;
                }
            },
            function(error) {

                console.log("Internal Server");
            }
        );
    }
    $scope.companylogin();

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

// app.directive('fileModel', ['$parse', function($parse) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             var model = $parse(attrs.fileModel);
//             var modelSetter = model.assign;

//             element.bind('change', function() {
//                 scope.$apply(function() {̶
//                     modelSetter(scope, element[0].files[0]);
//                 });
//             });

//         }
//     };
// }]);