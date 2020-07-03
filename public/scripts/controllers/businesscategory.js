app.controller('BusinessCategoryController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.MessageList = ['Restaurant', 'Salon', 'Beauty Parlour', 'Spa', 'Hospitals'];

    $scope.submitBusinessCategory = function() {
        var preForm = new FormData();
        angular.forEach($scope.files, function(file) {
            preForm.append("businessIcon", file);
        });
        preForm.append("id", $scope.Id);
        preForm.append("businessCategoryName", $scope.BusinessCategory);
        preForm.append("startDate", $scope.StartDate);
        preForm.append("bookingAmt", $scope.BookingAmount);
        preForm.append("clientAmt", $scope.ClientAmount);
        preForm.append("refundAmt", $scope.RefundAmount);
        preForm.append("csgtPercent", $scope.CGSTPercent);
        preForm.append("sgstPercent", $scope.SGSTPercent);
        preForm.append("igstPercent", $scope.IGSTPercent);
        if ($scope.Id != "0") {

            $http({
                url: imageroute + "/admin/updateCategoryMaster",
                method: "POST",
                data: preForm,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false },
            }).then(function(response) {
                    if (response.data.Data == 1) {
                        alert("Business Category Saved!");
                        $("#modal-lg").modal("toggle");
                        $scope.GetBusinessCategoryType();

                    } else {
                        $scope.btnsave = false;
                        alert("Unable to Save Business Category");
                    }
                },
                function(error) {
                    console.log(error);
                    $scope.btnsave = false;
                }
            );
        } else {
            $http({
                url: imageroute + "/admin/addCategoryMaster",
                method: "POST",
                data: preForm,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false },
            }).then(function(response) {
                    if (response.data.Data == 1) {
                        alert("Business Category Saved!");
                        $("#modal-lg").modal("toggle");
                        $scope.GetBusinessCategoryType();

                    } else {
                        $scope.btnsave = false;
                        alert("Unable to Save Business Category");
                    }
                },
                function(error) {
                    console.log(error);
                    $scope.btnsave = false;
                }
            );
        }
    }

    $scope.GetBusinessCategoryType = function() {
        $http({
            url: imageroute + "/admin/CategoryMaster",
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
    $scope.GetBusinessCategoryType();


    $scope.DeleteData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        $http({
            url: imageroute + "/admin/deleteCategoryMaster",
            method: "POST",
            cache: false,
            data: { id: id },
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data == 1) {
                    alert("Delete Successfully !");
                    $scope.GetBusinessCategoryType();

                } else {
                    alert("Data Not deleted !");
                    $scope.GetBusinessCategoryType();
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
        $scope.BusinessCategory = data.businessCategoryName;
        $scope.StartDate = new Date(data.startDate);
        $scope.BookingAmount = data.bookingAmt;
        $scope.ClientAmount = data.clientAmt;
        $scope.RefundAmount = data.refundAmt;
        $scope.CGSTPercent = data.csgtPercent;
        $scope.SGSTPercent = data.sgstPercent;
        $scope.IGSTPercent = data.igstPercent;
    }


    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.BusinessCategory = "";
        $scope.StartDate = "";
        $scope.BookingAmount = "";
        $scope.ClientAmount = "";
        $scope.RefundAmount = "";
        $scope.CGSTPercent = "";
        $scope.SGSTPercent = "";
        $scope.IGSTPercent = "";
        angular.element("input[type='file']").val(null);
    }
    $scope.Clear();
});