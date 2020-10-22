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
    $scope.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    $scope.CompanyId = undefined;
    $scope.selectedDays = {}
    $scope.onInit = function() {
        if (sessionStorage.getItem('Role') == 'company') {
            $scope.CompanyId = sessionStorage.getItem('SessionId')
        }
        $scope.GetCompany();
        $scope.GetInventory();
        $scope.GetBookingSlot();
    }
    
    $scope.GetCompany = function() {
        let filter = {_id: $scope.CompanyId};
        $http({
            url: imageroute + "/admin/getCompanyMaster",
            method: "POST",
            cache: false,
            data: filter,
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
    
    $scope.submitbookingslot = function() {
        let fromTimeHrs =  ($scope.FromTime.getHours() < 10 ?'0':'') + $scope.FromTime.getHours(); // new Date($scope.FromTime).getHours();
        let fromTimeMinutes = ($scope.FromTime.getMinutes() < 10 ?'0':'') + $scope.FromTime.getMinutes();  //new Date($scope.FromTime).getMinutes();
        let toTimeHrs = ($scope.ToTime.getHours() < 10 ?'0':'') + $scope.ToTime.getHours(); // new Date($scope.ToTime).getHours();
        let toTimeMinutes = ($scope.ToTime.getMinutes() < 10 ?'0':'') + $scope.ToTime.getMinutes();  // new Date($scope.ToTime).getMinutes()
        
        let from_minutes = $scope.FromTime.getMinutes();
        let from_hr = $scope.FromTime.getHours();
        let from_year = $scope.FromTime.getFullYear();
        let from_month = $scope.FromTime.getMonth();
        let from_date = $scope.FromTime.getDate();
        let from_seconds = $scope.FromTime.getSeconds();
        let from_milli = $scope.FromTime.getMilliseconds();
        
        let new_date = new Date(from_year,from_month,from_date,from_hr,from_minutes,from_seconds,from_milli);
        $scope.to_time = new_date;
        
        new_date.setMinutes(new_date.getMinutes() + $scope.DataList[0].inventoryId.appointmentMinutes);
        
        // let to_time = from_time_complete.setMinutes($scope.DataList[0].inventoryId.appointmentMinutes);
        var json = {
            "id": $scope.Id,
            "companyId": $scope.CompanyId,
            "inventoryId": $scope.InventoryId,
            "serviceProviderId": $scope.ServiceProviderId,
            "dayName": $scope.selectedDays, //$scope.DayName,
            "slotName": $scope.SlotName,
            "fromTime": `${fromTimeHrs}:${fromTimeMinutes}`,
            "toTime": `${new_date.getHours()}:${new_date.getMinutes()}`,
            "appointmentCount": $scope.AppointmentCount,
            "rate": 50,
            "appointmentMinutes": $scope.AppointmentMinutes
        };
        $http({
            url: imageroute + "/admin/addSlot",
            method: "POST",
            data: json,
            cache: false,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                $('#Totime').html(response.toTime);
                if (response.data.Data == 1) {
                    alert("Booking Slot Saved!");
                    $("#modal-lg").modal("toggle");
                    $scope.GetBookingSlot();
                    $scope.selectedDays = {}
                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save Booking Slot");
                }
            },
            function(error) {
                alert(error.data.Message);
                $scope.btnsave = false;
            }
        );

    }

    $scope.ServiceProvider = function() {
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
        // console.log($scope.ServiceProviderList);


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
            companyId: $scope.CompanyId || undefined,
            inventoryId: $scope.InventoryId || undefined,
            serviceProviderId: $scope.ServiceProviderId || undefined
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
        // $scope.CompanyId = "";
        $scope.InventoryId = "";
        $scope.ServiceProviderId = "";
        $scope.FromTime = "";
        $scope.ToTime = "";
        $scope.AppointmentCount = "";
        $scope.Rate = "";
        $scope.SlotName = "";
        $scope.selectedDays = {}
    }
    $scope.Clear();
    $scope.onInit();
});