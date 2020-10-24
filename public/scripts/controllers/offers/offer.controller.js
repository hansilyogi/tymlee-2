angular.module("TimelyModule")
    .controller('OffersController', function ($scope, $http, $q, fileUploader) {
        $scope.isAdmin = true;
        $scope.offers = [];
        $scope.model = {};
        $scope.files = {};
        //admin
        $scope.approved = function (data) {
            data.aprroveDate = moment().format()
            data.isApproved = true
            $http({
                url: imageroute + "/admin/offers/approved",
                method: "PUT",
                data: data,
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(function (response) {
                if (response.data.IsSuccess) {
                    alert("Offer Approved Successfully!");
                    $scope.getOffers($scope.isAdmin ? undefined : $scope.sessionId);
                    $scope.model = {};
                } else {
                    $scope.btnsave = false;
                    alert(response.data.Message || "Unable get list of offers!");
                }
            },
                function (error) {
                    alert(error.data.Message || "Unable get list of offers!");
                    $scope.btnsave = false;
                }
            );
        }
        //vendors
        function submitData() {
            $http({
                url: imageroute + "/admin/offers",
                method: "POST",
                data: $scope.model,
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(function (response) {
                if (response.data.IsSuccess) {
                    alert("Offer Created Successfully!");
                    $("#modal-vendor-lg").modal("toggle");
                    $scope.getOffers($scope.isAdmin ? undefined : $scope.sessionId);
                    $scope.model = {};
                } else {
                    $scope.btnsave = false;
                    alert(response.data.Message || "Unable get list of offers!");
                }
            },
                function (error) {
                    alert(error.data.Message || "Unable get list of offers!");
                    $scope.btnsave = false;
                }
            );
        }
        $scope.onSubmit = function () {
            if ($scope.model && !$scope.model.companyId && !$scope.isAdmin) {
                $scope.model.companyId = $scope.sessionId;
            }

            if ($scope.files.offerImage && $scope.files.offerImage.length) {
                var preForm = new FormData();

                angular.forEach($scope.files.offerImage, function (file) {
                    preForm.append("upload", file);
                });

                var promise = fileUploader.upload(preForm);
                promise.then(function (result) {
                    $scope.model.image = `customer/getImage/${result.data.data[0]._id}`,
                        $scope.model.attachment = result.data.data[0]._id
                    submitData()
                }, function (reason) {
                    alert('Unable to Upload the files!')
                });
            } else {
                submitData()
            }

        }

        $scope.getOffers = function (id) {
            $http({
                url: imageroute + "/admin/offers",
                method: "GET",
                data: { _id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(function (response) {
                if (response.data.isSuccess) {
                    $scope.offers = response.data.Data;
                } else {
                    $scope.btnsave = false;
                    alert("Unable get list of offers!");
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
            $scope.model.startDate = new Date(data.startDate);
            $scope.model.endDate = new Date(data.endDate);
        }
        function init() {
            $scope.isAdmin = sessionStorage.getItem("Role") == 'admin';
            $scope.sessionId = sessionStorage.getItem("SessionId");
            $scope.getOffers($scope.isAdmin ? undefined : $scope.sessionId)
        }

        $scope.delete = function (data) {
            let _confirm = confirm("Are you sure you want to delete this ?");
            if (_confirm) {
                $http({
                    url: imageroute + "/admin/offers/" + data,
                    method: "delete",
                    // data: data,
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                }).then(result => {
                    if (result && result.data && result.data.IsSuccess) {
                        alert("Offer deleted successfully!");
                        $scope.getOffers($scope.isAdmin ? undefined : $scope.sessionId);
                    } else {
                        alert(result.data.Message || "Unable delete the offer!");
                    }
                }).catch(err => {
                    alert(err.data.Message || "Unable delete offers!");
                })
            }
        }
        init()
    })
    .service('fileUploader', function ($http) {
        this.upload = function (data) {
            return $http({
                url: imageroute + "/customer/uploader",
                method: "POST",
                data: data,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false },
            })
        }
    });