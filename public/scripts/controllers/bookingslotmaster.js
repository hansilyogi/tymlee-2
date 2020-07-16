app.controller('BookingSlotMasterController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.CompanyList = [];
    $scope.InventoryList = [];
    $scope.serviceProviderDataList = false;
    $scope.VisibleData = false;
    $scope.ServiceProviderList = [];
    $scope.MessageList = ['Restaurant', 'Salon', 'Beauty Parlour', 'Spa', 'Hospitals'];


    $scope.GetCompany = function() {
        $http({
            url: imageroute + "/admin/getCompanyMaster",
            method: "POST",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.CompanyList = response.data.Data;

                } else {
                    $scope.CompanyList = [];
                }
            },
            function(error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.GetCompany();

    $scope.GetInventory = function() {
        $scope.serviceProviderDataList = false;
        $scope.VisibleData = false;
        var list = {
            companyId: $scope.CompanyId
        }
        $http({
            url: imageroute + "/admin/getInventoryAndServiceListByCompanyId",
            method: "POST",
            cache: false,
            data: list,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.InventoryList = response.data.Data;
                } else {
                    $scope.InventoryList = [];
                }
            },
            function(error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.GetInventory();

    $scope.submitbookingslot = function() {
        var json = {
            "id": $scope.Id,
            "companyId": $scope.CompanyId,
            "inventoryId": $scope.InventoryId,
            "serviceProviderId": $scope.ServiceProviderId,
            "dayName": $scope.DayName,
            "slotName": $scope.SlotName,
            "fromTime": $scope.FromTime,
            "toTime": $scope.ToTime,
            "appointmentCount": $scope.AppointmentCount,
            "rate": $scope.Rate
        };
        $http({
            url: imageroute + "/admin/addSlot",
            method: "POST",
            data: json,
            cache: false,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("Booking Slot Saved!");
                    $("#modal-lg").modal("toggle");
                    $scope.GetBookingSlot();
                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save Booking Slot");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );

    }

    $scope.ServiceProvider = function() {
        console.log($scope.InventoryId);
        $scope.ServiceProviderList = [];
        for (let i = 0; i < $scope.InventoryList.length; i++) {
            if ($scope.InventoryList[i].Inventory._id == $scope.InventoryId) {
                if ($scope.InventoryList[i].Inventory.multipleServiceProviderRequired == true) {
                    $scope.serviceProviderDataList = true;
                    $scope.VisibleData = true;
                    $scope.ServiceProviderList = $scope.InventoryList[i].serviceProviders;
                } else {
                    $scope.serviceProviderDataList = false;
                    $scope.VisibleData = false;
                }
            }
        }
        console.log($scope.ServiceProviderList);


        var list = {
            companyId: $scope.CompanyId,
            inventoryId: $scope.InventoryId,
        }
        $http({
            url: imageroute + "/admin/getSlot",
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

    $scope.GetBookingSlot = function() {
        var list = {
            companyId: $scope.CompanyId,
            inventoryId: $scope.InventoryId,
            serviceProviderId: $scope.ServiceProviderId
        }
        $http({
            url: imageroute + "/admin/getSlot",
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
    $scope.GetBookingSlot();


    $scope.DeleteData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        if (result) {
            $http({
                url: imageroute + "/admin/deleteSlot",
                method: "POST",
                cache: false,
                data: { id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.Data == 1) {
                        alert("Delete Successfully !");
                        $scope.GetBookingSlot();

                    } else {
                        alert("Data Not deleted !");
                        $scope.GetBookingSlot();
                    }
                },
                function(error) {
                    console.log("Internal Server");
                }
            );
        }
    }

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


    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.DayName = "";
        $scope.CompanyId = "";
        $scope.InventoryId = "";
        $scope.ServiceProviderId = "";
        $scope.FromTime = "";
        $scope.ToTime = "";
        $scope.AppointmentCount = "";
        $scope.Rate = "";
    }
    $scope.Clear();
});