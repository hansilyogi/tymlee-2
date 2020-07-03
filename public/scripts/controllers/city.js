app.controller('CityController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];

    $scope.submitCity = function() {
        var json = {
            "id": $scope.Id,
            "cityCode": $scope.CityCode,
            "cityName": $scope.CityName,
            "stateCode": $scope.StateCode,
            "stateName": $scope.StateName
        };
        $http({
            url: imageroute + "/admin/addCityMaster",
            method: "POST",
            data: json,
            cache: false,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("City Saved!");
                    $("#modal-lg").modal("toggle");
                    $scope.GetCity();

                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save City");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );

    }

    $scope.GetCity = function() {
        $http({
            url: imageroute + "/admin/getCityMaster",
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
                console.log("Insternal Server");
            }
        );
    }
    $scope.GetCity();


    $scope.DeleteData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        $http({
            url: imageroute + "/admin/deleteCityMaster",
            method: "POST",
            cache: false,
            data: { id: id },
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data == 1) {
                    alert("Delete Successfully !");
                    $scope.GetCity();

                } else {
                    alert("Data Not deleted !");
                    $scope.GetCity();
                }
            },
            function(error) {
                console.log("Insternal Server");
            }
        );
    }

    $scope.EditData = function(data) {
        $('#modal-lg').modal();
        console.log(data);
        $scope.Id = data._id;
        $scope.CityCode = data.cityCode;
        $scope.CityName = data.cityName;
        $scope.StateName = data.stateName;
        $scope.StateCode = data.stateCode;
    }


    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.CityCode = "";
        $scope.CityName = "";
        $scope.StateName = "";
        $scope.StateCode = "";
    }
    $scope.Clear();
});