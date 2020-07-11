app.controller('AddCompanyInventoryController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.SelectedDataList = [];
    $scope.RateTypeList = ['Fixed', 'Variable'];
    $scope.defaultInventory = true;
    $scope.datano = true;
    $scope.toggleyes = false;
    $scope.AddData = function() {
        $scope.SelectedDataList = [];
        if ($scope.ServiceProviderName != '' && $scope.ServiceProviderDescription != '' && $scope.AppointmentMinutes != '' && $scope.RateAmount != '' && $scope.RateType != '') {
            // ADD A NEW ELEMENT.
            $scope.SelectedDataList.push({ iventoryName: $scope.InventoryName, inventorydec: $scope.InventoryDescription, name: $scope.ServiceProviderName, description: $scope.ServiceProviderDescription, appointmentmin: $scope.AppointmentMinutesData, rateamount: $scope.RateAmountData, ratetype: $scope.RateTypeData });

        }

        console.log($scope.SelectedDataList);

        $scope.ServiceProviderName = "";
        $scope.ServiceProviderDescription = "";
        $scope.AppointmentMinutesData = "";
        $scope.RateAmountData = "";
        $scope.RateTypeData = "";
    }

    $scope.DeleteDataList = function(i) {
        $scope.SelectedDataList.splice(i, 1);
        console.log($scope.SelectedDataList);
    }

    $scope.submitCompanyInventory = function() {
        if ($scope.toggleyes == false) {
            var json = {
                "id": $scope.Id,
                "inventoryName": $scope.InventoryName,
                "inventoryDescription": $scope.InventoryDescription,
                "stamultipleServiceProviderRequiredteCode": $scope.toggleyes,
                "appointmentMinutes": $scope.AppointmentMinutes,
                "multipleServiceProviderRequired": $scope.YesNo,
                "rateType": $scope.RateType,
                "rateAmt": $scope.RateAmount,
                "inventoryNotes1Name": $scope.InventoryNotes1Name,
                "inventoryNotes1": $scope.InventoryNotes1,
                "inventoryNotes2Name": $scope.InventoryNotes2Name,
                "inventoryNotes2": $scope.InventoryNotes2,
                "inventoryNotes3Name": $scope.InventoryNotes3Name,
                "inventoryNotes3": $scope.InventoryNotes3
            };
            console.log(json);
        } else {
            var json = [];

            angular.forEach($scope.SelectedDataList, function(value, key) {
                var data = {
                    "inventoryName": $scope.SelectedDataList[key]["iventoryName"],
                    "inventoryDescription": $scope.SelectedDataList[key]["inventorydec"],
                    "stamultipleServiceProviderRequiredteCode": $scope.toggleyes,
                    "serviceProviderName": $scope.SelectedDataList[key]["name"],
                    "serviceProviderDescription": $scope.SelectedDataList[key]["description"],
                    "appointmentMinutes": $scope.SelectedDataList[key]["appointmentmin"],
                    "rateType": $scope.SelectedDataList[key]["ratetype"],
                    "rateAmt": $scope.SelectedDataList[key]["rateamount"]
                }
                json.push(data);
            });
        }
        $http({
            url: imageroute + "/admin/addInventoryAndServiceProvider",
            method: "POST",
            data: json,
            cache: false,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("Company Inventory Saved!");
                    $("#modal-lg").modal("toggle");
                    // $scope.GetCity();

                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save Company Inventory");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );
    }


    $scope.tooglelistner = function() {
        if ($scope.toggleyes == true) {
            $scope.defaultInventory = false;
            $scope.serviceProvider = true;
        } else {
            $scope.defaultInventory = true;
            $scope.serviceProvider = false;
        }
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

    // $scope.EditData = function(data) {
    //     $('#modal-lg').modal();
    //     console.log(data);
    //     $scope.Id = data._id;
    //     $scope.BusinessCategory = data.businessCategoryName;
    //     $scope.StartDate = new Date(data.startDate);
    //     $scope.BookingAmount = data.bookingAmt;
    //     $scope.ClientAmount = data.clientAmt;
    //     $scope.RefundAmount = data.refundAmt;
    //     $scope.CGSTPercent = data.csgtPercent;
    //     $scope.SGSTPercent = data.sgstPercent;
    //     $scope.IGSTPercent = data.igstPercent;
    // }


    // $scope.Clear = function() {
    //     $scope.Id = 0;
    //     $scope.BusinessCategory = "";
    //     $scope.StartDate = "";
    //     $scope.BookingAmount = "";
    //     $scope.ClientAmount = "";
    //     $scope.RefundAmount = "";
    //     $scope.CGSTPercent = "";
    //     $scope.SGSTPercent = "";
    //     $scope.IGSTPercent = "";
    //     angular.element("input[type='file']").val(null);
    // }
    // $scope.Clear();
});