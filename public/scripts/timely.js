var imageroute = window.location.origin;
var assets_image_url = "http://65.0.17.89:5000/api/upload";
var assets_server_url = "http://65.0.17.89:5000";
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
        .when("/vendor-profile", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./scripts/controllers/vendor/vendor-profile.html",
            controller: "VendorProfileController",
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
        .when("/states", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./scripts/controllers/states/state.html",
            controller: "StatesController",
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
        .when("/vendorbanners", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./scripts/controllers/vendorBanners/vendorsBanners.html",
            controller: "VendorBannersController",
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
        .when("/serviceprovider", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/serviceprovider.html",
            controller: "ServiceProviderController",
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
        })
        .when("/offers", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./scripts/controllers/offers/offer.html",
            controller: "OffersController",
        })
        .when("/banner-master", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./scripts/controllers/bannerMaster/bannerMaster.html",
            controller: "BannerMastersController",
        })
        .when("/bill", {
            resolve: {
                check: function() {
                    if (sessionStorage.getItem("SessionId") == null) {
                        window.location.href = "./404";
                    }
                },
            },
            templateUrl: "./pages/bill.html",
            controller: "BillController",
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
                if (response.data.Data.length == 1) {
                    $scope.DataList = response.data.Data[0];
                    $scope.errorstyle = { color: "green" };
                    $scope.errormessages = "User Authenticated Successfully";
                    sessionStorage.setItem("SessionId", $scope.DataList._id);
                    sessionStorage.setItem("Username", $scope.DataList.userName);
                    sessionStorage.setItem("Role", "admin");

                    window.location.href = "./#!/dashboard";

                } else {
                    $scope.errormessages = "Invalid Data";
                    alert("Invalid Data");
                }
            },
            function(error) {
                $scope.errormessages = "Internal Server";
                alert("Internal Server");
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
        var datalist = {
            adminEmail: companyEmail,
            adminPassword: password
        }

        $http({
            url: imageroute + "/admin/companySignIn",
            method: "POST",
            cache: false,
            data: datalist,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length == 1) {
                    $scope.DataList = response.data.Data[0];
                    $scope.errorstyle = { color: "green" };
                    $scope.errormessages = "User Authenticated Successfully";
                    sessionStorage.setItem("SessionId", $scope.DataList._id);
                    sessionStorage.setItem("Username", $scope.DataList.companyName);
                    sessionStorage.setItem("Role", "company");

                    window.location.href = "./#!/dashboard";

                } else {
                    $scope.errormessages = "Invalid Data";
                    alert("Invalid Data");
                }
            },
            function(error) {
                $scope.errormessages = "Internal Server";
                alert("Internal Server");
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


    $scope.logOutUser = function() {
        sessionStorage.clear();
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