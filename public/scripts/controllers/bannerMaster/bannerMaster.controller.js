angular.module("TimelyModule")
    .controller('BannerMastersController', function ($scope, $http, $q, fileUploader) {
        $scope.isAdmin = true;
        $scope.bannerMaster = [];
        $scope.model = {};
        $scope.bannerTypes = ['General', 'Low', 'Medium', 'High'];
        $scope.bannerSizes = ['Full', 'Half', 'One Third'];

        //admin
        $scope.onSubmit = function () {
            $http({
                url: imageroute + "/admin/bannerMaster",
                method: "POST",
                data: $scope.model,
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(function (response) {
                if (response.data.IsSuccess) {
                    alert("Banner Master saved!");
                    $("#modal-lg").modal("toggle");
                    $scope.getBannerMaster($scope.isAdmin ? undefined : $scope.sessionId);
                    $scope.model = {};
                } else {
                    $scope.btnsave = false;
                    alert(response.data.Message || "Unable get list of banner master!");
                }
            },
                function (error) {
                    alert(error.data.Message || "Unable get list of banner master!");
                    $scope.btnsave = false;
                }
            );

        }

        $scope.getBannerMaster = function (id) {
            $http({
                url: imageroute + "/admin/bannerMaster",
                method: "GET",
                data: { _id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(function (response) {
                if (response.data.isSuccess) {
                    $scope.bannerMaster = response.data.Data;
                } else {
                    $scope.btnsave = false;
                    alert("Unable get list of bannerMaster!");
                }
            },
                function (error) {
                    console.log(error);
                    $scope.btnsave = false;
                }
            );
        }
        //common
        $scope.closeModal = function () {
            $scope.model = {}
        }
        $scope.onEdit = function (data) {
            $scope.model = data;
        }
        function init() {
            $scope.isAdmin = sessionStorage.getItem("Role") == 'admin';
            $scope.sessionId = sessionStorage.getItem("SessionId");
            $scope.getBannerMaster($scope.isAdmin ? undefined : $scope.sessionId)
        }

        $scope.delete = function (data) {
            let _confirm = confirm("Are you sure you want to delete this ?");
            if (_confirm) {
                $http({
                    url: imageroute + "/admin/bannerMaster/" + data,
                    method: "delete",
                    // data: data,
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                }).then(result => {
                    if (result && result.data && result.data.IsSuccess) {
                        alert("Banner Master deleted successfully!");
                        $scope.getBannerMaster($scope.isAdmin ? undefined : $scope.sessionId);
                    } else {
                        alert(result.data.Message || "Unable delete the Banner Master!");
                    }
                }).catch(err => {
                    alert(err.data.Message || "Unable delete offers!");
                })
            }
        }
        init()
    });