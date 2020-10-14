app.controller('AddCompanyInventoryController', function ($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = undefined;
    $scope.DataList = [];
    $scope.SelectedDataList = [];
    $scope.RateTypeList = ['Fixed', 'Variable'];
    $scope.defaultInventory = true;
    $scope.datano = true;
    $scope.toggleyes = false;
    $scope.companies = [];
    $scope.AddData = function () {
        // $scope.SelectedDataList = [];
        // $scope.SelectedDataList.push({ iventoryName: $scope.InventoryName, inventorydec: $scope.InventoryDescription, name: $scope.ServiceProviderName, description: $scope.ServiceProviderDescription, appointmentmin: $scope.AppointmentMinutesData, rateamount: $scope.RateAmountData, ratetype: $scope.RateTypeData });
        // console.log($scope.SelectedDataList);


        $scope.SelectedDataList.push({ iventoryName: $scope.InventoryName, inventorydec: $scope.InventoryDescription, name: $scope.ServiceProviderName, description: $scope.ServiceProviderDescription, appointmentmin: $scope.AppointmentMinutesData, rateamount: $scope.RateAmountData, ratetype: $scope.RateTypeData });
        // console.log($scope.SelectedDataList);


        $scope.ServiceProviderName = "";
        $scope.ServiceProviderDescription = "";
        $scope.AppointmentMinutesData = "";
        $scope.RateAmountData = "";
        $scope.RateTypeData = "";
    }

    $scope.DeleteDataList = function (i) {
        $scope.SelectedDataList.splice(i, 1);
        // console.log($scope.SelectedDataList);
    }

    $scope.init = function () {
        let role = sessionStorage.getItem("Role");
        $scope.companyId = null;
        if (role == 'company') {
            $scope.companyId = sessionStorage.getItem("SessionId");
            $scope.loadCompanyInventory();
        } else {
            $scope.loadCompany();
        }

    };
    $scope.submitCompanyInventory = function () {
        if ($scope.toggleyes == false) {
            var inventory = {
                "id": $scope.Id,
                "companyId": $scope.companyId, //"5f04587fdd1ead1304d025ad",
                "inventoryName": $scope.InventoryName,
                "inventoryDescription": $scope.InventoryDescription,
                "appointmentMinutes": $scope.AppointmentMinutes,
                // "multipleServiceProviderRequired": $scope.toggleyes,
                "rateType": $scope.RateType,
                "rateAmt": $scope.RateAmount,
                "inventoryNotes1Name": $scope.InventoryNotes1Name,
                "inventoryNotes1": $scope.InventoryNotes1,
                "inventoryNotes2Name": $scope.InventoryNotes2Name,
                "inventoryNotes2": $scope.InventoryNotes2,
                "inventoryNotes3Name": $scope.InventoryNotes3Name,
                "inventoryNotes3": $scope.InventoryNotes3
            };
            // console.log(inventory);
        }
        if ($scope.toggleyes == true) {
            var json = [];

            angular.forEach($scope.SelectedDataList, function (value, key) {
                var data = {

                    "serviceProviderName": $scope.SelectedDataList[key]["name"],
                    "serviceProviderDescription": $scope.SelectedDataList[key]["description"],
                    "appointmentMinutes": $scope.SelectedDataList[key]["appointmentmin"],
                    "rateType": $scope.SelectedDataList[key]["ratetype"],
                    "rateAmt": $scope.SelectedDataList[key]["rateamount"]
                }
                json.push(data);
            });
            var inventory = {
                "companyId": $scope.companyId,
                "inventoryName": $scope.InventoryName,
                "inventoryDescription": $scope.InventoryDescription,
                // "multipleServiceProviderRequired": $scope.toggleyes,
                "inventoryNotes1Name": $scope.InventoryNotes1Name,
                "inventoryNotes1": $scope.InventoryNotes1,
                "inventoryNotes2Name": $scope.InventoryNotes2Name,
                "inventoryNotes2": $scope.InventoryNotes2,
                "inventoryNotes3Name": $scope.InventoryNotes3Name,
                "inventoryNotes3": $scope.InventoryNotes3,
                "serviceProvider": json
            }
        }
        let actionUrl = $scope.Id ? '/admin/updateInventory' : '/admin/addInventoryAndServiceProvider';
        $http({
            url: imageroute + actionUrl,
            method: "POST",
            data: inventory,
            cache: false,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function (response) {
            if (response.data.IsSuccess) {
                alert("Company Inventory Saved!");
                $("#modal-lg").modal("toggle");
                $scope.Clear();
                $scope.loadCompanyInventory();
                $scope.SelectedDataList = [];
                // $scope.GetCity();

            } else {
                $scope.btnsave = false;
                alert("Unable to Save Company Inventory");
            }
        },
            function (error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );
    }


    $scope.tooglelistner = function () {
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

    $scope.EditData = function (data) {
        $('#modal-lg').modal();
        console.log(data);
        $scope.Id = data._id;
        $scope.InventoryName = data.inventoryName;
        $scope.InventoryDescription = data.inventoryDescription;
        $scope.companyId = data.companyId;
        $scope.AppointmentMinutes = data.appointmentMinutes;
        $scope.RateType = data.rateType;
        $scope.RateAmount = data.rateAmt;
        $scope.InventoryNotes1Name = data.inventoryNotes1Name;
        $scope.InventoryNotes1 = data.inventoryNotes1;
        $scope.InventoryNotes2 = data.inventoryNotes2;
        $scope.InventoryNotes2Name = data.inventoryNotes2Name;
        $scope.InventoryNotes3Name = data.inventoryNotes3;
        $scope.InventoryNotes3 = data.inventoryNotes3Name;
        // $scope.BusinessCategory = data.businessCategoryName;
        // $scope.StartDate = new Date(data.startDate);
        // $scope.BookingAmount = data.bookingAmt;
        // $scope.ClientAmount = data.clientAmt;
        // $scope.RefundAmount = data.refundAmt;
        // $scope.CGSTPercent = data.csgtPercent;
        // $scope.SGSTPercent = data.sgstPercent;
        // $scope.IGSTPercent = data.igstPercent;


    }

    $scope.loadCompanyInventory = function () {
        $http({
            url: imageroute + "/admin/getInventoryByCompanyId",
            method: "POST",
            cache: false,
            data: { companyId: $scope.companyId },
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function (response) {
                if (response.data.Data.length >= 1) {
                    $scope.inventories = response.data.Data;
                } else {
                    $scope.companies = [];
                }
            },
            function (error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.loadCompany = function () {
        $http({
            url: imageroute + "/admin/getCompanyMaster",
            method: "POST",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function (response) {
                if (response.data.Data.length >= 1) {
                    $scope.companies = response.data.Data;
                } else {
                    $scope.companies = [];
                }
            },
            function (error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.Clear = function () {
        $scope.Id = undefined;
        $scope.InventoryName = "";
        $scope.InventoryDescription = "";
        $scope.AppointmentMinutes = "";
        $scope.RateType = "";
        $scope.RateAmount = "";
        $scope.InventoryNotes1Name = "";
        $scope.InventoryNotes1 = "";
        $scope.InventoryNotes2Name = "";
        $scope.InventoryNotes2 = "";
        $scope.InventoryNotes3Name = "";
        $scope.InventoryNotes3 = "";
        $scope.ServiceProviderName = "";
        $scope.ServiceProviderDescription = "";
        $scope.AppointmentMinutesData = "";
        $scope.RateTypeData = "";
        $scope.RateAmountData = "";
    }
    $scope.Clear();
    $scope.init();
});