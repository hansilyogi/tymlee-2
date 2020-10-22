// 'use strict';
angular.module("TimelyModule")
.controller('StatesController', function ($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.states = [];

    $scope.submitState = function () {
        $http({
            url: imageroute + "/admin/states",
            method: "POST",
            data: $scope.model,
            cache: false,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                alert("State Saved!");
                $("#modal-lg").modal("toggle");
                $scope.loadStates();
                $scope.model = {};
            } else {
                $scope.btnsave = false;
                alert("Unable to Save State");
            }
        },
            function (error) {
                console.log(error);
                $scope.btnsave = false;
                alert(error.data.Message || "Unable to Save State");
            }
        );

    }

    $scope.loadStates = function () {
        $http({
            url: imageroute + "/admin/states",
            method: "GET",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function (response) {
                if (response.data.Data.length >= 1) {
                    $scope.states = response.data.Data;

                } else {
                    $scope.states = [];
                }
            },
            function (error) {
                console.log("Internal Server");
            }
        );
    }



    $scope.DeleteData = function (id) {
        var res = true;
        // var result = confirm("Are you sure you want to delete this ?");
        if (res) {
            $http({
                url: imageroute + "/admin/states/" + id,
                method: "delete",
                cache: false,
                data: { id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function (response) {
                    var result = confirm("Are you sure you want to delete this ?");
                    if(result){
                        if (response.data.IsSuccess) {
                            alert("Delete Successfully !");
                            $scope.loadStates();
                        } else {
                            alert("Data Not deleted !");
                            $scope.loadStates();
                        }
                    }
                },
                function (error) {
                    console.log("Internal Server");
                    alert(error.data.Message || "Unable to Save State");
                }
            );
        }
    }

    $scope.EditData = function (data) {
        $('#modal-lg').modal();
        $scope.model = JSON.parse(JSON.stringify(data))
    }


    function onInit() {
        this.modal = {
            stateData: {}
        }
        $scope.loadStates()
    }
    onInit()
});