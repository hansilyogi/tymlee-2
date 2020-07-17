app.controller('BookingHistoryController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.MessageList = ['Restaurant', 'Salon', 'Beauty Parlour', 'Spa', 'Hospitals'];



    $scope.GetBookingHistory = function() {

        $http({
            url: imageroute + "/admin/getBookingHistory",
            method: "POST",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.DataList = response.data.Data;

                } else {
                    $scope.DataList = [];
                }
            },
            function(error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.GetBookingHistory();


});