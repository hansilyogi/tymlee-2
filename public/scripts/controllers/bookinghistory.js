app.controller('BookingHistoryController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.PendingList = [];
    $scope.CompletedList = [];
    $scope.CancelledList = [];
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
                    for (let i = 0; i < $scope.DataList.length; i++) {
                        $scope.PendingList = $scope.DataList[i].Pending;
                        $scope.CompletedList = $scope.DataList[i].Complete;
                        $scope.CancelledList = $scope.DataList[i].Cancelled;
                    }
                    console.log($scope.CompletedList);
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

    $scope.GetPendingOtherDetails = function(data) {
        $scope.GetPendingOtherDetailList = [];
        $scope.GetPendingOtherDetailList.push(data);

    }

    $scope.GetCompletedOtherDetails = function(data) {
        $scope.GetCompletedOtherDetailList = [];
        $scope.GetCompletedOtherDetailList.push(data);

    }

    $scope.GetCancelledOtherDetails = function(data) {
        $scope.GetCancelledOtherDetailList = [];
        $scope.GetCancelledOtherDetailList.push(data);

    }
});