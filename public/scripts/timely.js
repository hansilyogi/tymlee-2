var imageroute = window.location.origin;
var app = angular.module("TimelyModule", ["ngRoute", "datatables"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "pages/dashboard.html",
            controller: "DashboardController",
        })
        .when("/dashboard", {
            templateUrl: "pages/dashboard.html",
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