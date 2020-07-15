app.controller('BookingSlotMasterController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.CompanyList = [];
    $scope.InventoryList = [];
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
                console.log("Insternal Server");
            }
        );
    }
    $scope.GetCompany();

    $scope.GetInventory = function() {
        var list = {
            companyId: $scope.CompanyId
        }
        $http({
            url: imageroute + "/admin/getCompanyInventory",
            method: "POST",
            cache: false,
            data: list,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.InventoryList = response.data.Data;
                    if ($scope.InventoryList.multipleServiceProviderRequired == true) {
                        $scope.Multiple = true;
                    } else {
                        $scope.Multiple = false;
                    }

                } else {
                    $scope.InventoryList = [];
                }
            },
            function(error) {
                console.log("Insternal Server");
            }
        );
    }
    $scope.GetInventory();

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