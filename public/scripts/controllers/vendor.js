app.controller('VendorController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.MessageList = ['QueueManager', 'UnitManager'];
    $scope.CompanyList = [];



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


    $scope.submitVendor = function() {
        var json = {
            "id": $scope.Id,
            "companyId": $scope.CompanyId,
            "userName": $scope.UserName,
            "userPin": $scope.UserPin,
            "emailId": $scope.Email,
            "userPassword": $scope.UserPassword,
            "userCategory": $scope.UserCategory
        };
        $http({
            url: imageroute + "/admin/addCityMaster",
            method: "POST",
            data: json,
            cache: false,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("Vendor Saved!");
                    $("#modal-lg").modal("toggle");
                    $scope.GetVendor();

                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save Vendor");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );

    }

    $scope.GetVendor = function() {
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
    $scope.GetVendor();


    $scope.DeleteData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        if (result) {
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
                        $scope.GetVendor();

                    } else {
                        alert("Data Not deleted !");
                        $scope.GetVendor();
                    }
                },
                function(error) {
                    console.log("Insternal Server");
                }
            );
        }
    }

    $scope.EditData = function(data) {
        $('#modal-lg').modal();
        console.log(data);
        $scope.Id = data._id;
        $scope.CompanyId = data.companyId;
        $scope.UserName = data.userName;
        $scope.UserPin = data.userPin;
        $scope.UserCategory = data.userCategory;
        $scope.UserPassword = data.userPassword;
    }


    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.CompanyId = "";
        $scope.UserName = "";
        $scope.UserPin = "";
        $scope.UserCategory = "";
        $scope.UserPassword = "";
    }
    $scope.Clear();
});