var imageroute = window.location.origin;
var app = angular.module("TimelyModule", ["ngRoute"]);
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