app.controller('AddCompanyInventoryController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.SelectedDataList = [];
    $scope.RateTypeList = ['Fixed', 'Variable'];

    $scope.AddData = function() {
        $scope.SelectedDataList = [];
        if ($scope.ServiceProviderName != '' && $scope.ServiceProviderDescription != '' && $scope.AppointmentMinutes != '' && $scope.RateAmount != '' && $scope.RateType != '') {
            // ADD A NEW ELEMENT.
            $scope.SelectedDataList.push({ name: $scope.ServiceProviderName, description: $scope.ServiceProviderDescription, appointmentmin: $scope.AppointmentMinutes, rateamount: $scope.RateAmount, ratetype: $scope.RateType });

        }

        console.log($scope.SelectedDataList);

        $scope.ServiceProviderName = "";
        $scope.ServiceProviderDescription = "";
        $scope.AppointmentMinutes = "";
        $scope.RateAmount = "";
        $scope.RateType = "";
    }

    $scope.DeleteDataList = function(i) {
        $scope.SelectedDataList.splice(i, 1);
        console.log($scope.SelectedDataList);
    }

    $scope.submitCity = function() {
        var json = {
            "id": $scope.Id,
            "cityCode": $scope.InventoryName,
            "cityName": $scope.InventoryDescription,
            "stateCode": $scope.YesNo,
        };

        $http({
            url: imageroute + "/admin/addInventoryAndServiceProvider",
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

    // $scope.GetBusinessCategoryType = function() {
    //     $http({
    //         url: imageroute + "/admin/CategoryMaster",
    //         method: "POST",
    //         cache: false,
    //         data: {},
    //         headers: { "Content-Type": "application/json; charset=UTF-8" },
    //     }).then(
    //         function(response) {
    //             if (response.data.Data.length >= 1) {
    //                 $scope.DataList = response.data.Data;

    //             } else {
    //                 $scope.DataList = [];
    //             }
    //         },
    //         function(error) {
    //             console.log("Insternal Server");
    //         }
    //     );
    // }
    // $scope.GetBusinessCategoryType();


    // $scope.DeleteData = function(id) {
    //     var result = confirm("Are you sure you want to delete this ?");
    //     if (result) {
    //         $http({
    //             url: imageroute + "/admin/deleteCategoryMaster",
    //             method: "POST",
    //             cache: false,
    //             data: { id: id },
    //             headers: { "Content-Type": "application/json; charset=UTF-8" },
    //         }).then(
    //             function(response) {
    //                 if (response.data.Data == 1) {
    //                     alert("Delete Successfully !");
    //                     $scope.GetBusinessCategoryType();

    //                 } else {
    //                     alert("Data Not deleted !");
    //                     $scope.GetBusinessCategoryType();
    //                 }
    //             },
    //             function(error) {
    //                 console.log("Insternal Server");
    //             }
    //         );
    //     }
    // }

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