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
        })
        .when("/bookingslotmaster", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/bookingslotmaster.html",
            controller: "BookingSlotMasterController",
        })
        .when("/bookinghistory", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/bookinghistory.html",
            controller: "BookingHistoryController",
        })
        .when("/companytransaction", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/companytransaction.html",
            controller: "ViewCompanyTransactionController",
        })
        .when("/sendnotification", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/sendnotification.html",
            controller: "SendNotificationController",
        });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })
});


app.controller('LoginController', function($scope, $http) {

    $scope.errormessages = "Sign in to start your session";



    $scope.login = function() {
        var userName = $scope.username;
        var password = $scope.Password;
        var datalist = {
            userName: userName,
            password: password
        }

        $http({
            url: imageroute + "/admin/adminSignIn",
            method: "POST",
            cache: false,
            data: datalist,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                console.log(response.data);
                if (response.data.Data.length == 1) {
                    $scope.DataList = response.data.Data[0];
                    $scope.errorstyle = { color: "green" };
                    $scope.errormessages = "User Authenticated Successfully";
                    sessionStorage.setItem("SessionId", $scope.DataList._id);
                    sessionStorage.setItem("Username", $scope.DataList.userName);
                    sessionStorage.setItem("Role", "admin");

                    window.location.href = "./#!/dashboard";

                }
            },
            function(error) {

                console.log("Internal Server");
            }
        );
    }

    $scope.companyLoginData = function() {
        window.location.href = "./companylogin.html";
    }


});

app.controller('CompanyLoginController', function($scope, $http) {

    $scope.errormessages = "Sign in to start your session";

    $scope.companylogin = function() {
        var companyEmail = $scope.CompanyEmail;
        var password = $scope.Password;
        var companyCode = $scope.CompanyCode;
        var datalist = {
            adminEmail: companyEmail,
            adminPassword: password,
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
                    $scope.DataList = response.data.Data[0];
                    $scope.errorstyle = { color: "green" };
                    $scope.errormessages = "User Authenticated Successfully";
                    sessionStorage.setItem("SessionId", $scope.DataList._id);
                    sessionStorage.setItem("Username", $scope.DataList.companyName);
                    sessionStorage.setItem("Role", "company");

                    window.location.href = "./#!/dashboard";

                }
            },
            function(error) {

                console.log("Internal Server");
            }
        );
    }


});



app.controller('IndexController', function($scope, $http) {

    var LoginUser = sessionStorage.getItem("SessionId");
    var LoginRole = sessionStorage.getItem("Role");
    var LoginName = sessionStorage.getItem("Username");

    if (LoginUser != null && LoginUser != undefined) {
        if (LoginRole == "company") {
            $scope.CompanyId = LoginUser;
            $scope.LoginName = LoginName;
        } else
            $scope.IsVisible = true;
        $scope.LoginName = LoginName;
    } else {
        window.location.href = "login.html";
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