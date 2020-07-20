app.controller('SendNotificationController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.MessageList = ['Customer', 'Vendor'];


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


    $scope.GetDataList = function() {
        var list = {
            "companyId": $scope.CompanyId,
            "type": $scope.Type
        }
        $http({
            url: imageroute + "/admin/sendNotification",
            method: "POST",
            cache: false,
            data: list,
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
    $scope.GetDataList();

});