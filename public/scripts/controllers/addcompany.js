app.controller('AddCompanyController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.BusinessCategoryList = [];
    $scope.MessageList = ['Prop', 'Patnership', 'Pvt.Ltd', 'LLp', 'LTD'];
    $scope.CityList = [];
    $scope.BankDataList = [];

    // $scope.submitCompany = function() {
    //     var preForm = new FormData();
    //     angular.forEach($scope.files, function(file) {
    //         preForm.append("personPhoto", file);
    //         preForm.append("aadharCard", file);
    //         preForm.append("panCard", file);
    //         preForm.append("cancelledCheque", file);
    //         preForm.append("companyLogo", file);
    //     });
    //     preForm.append("id", $scope.Id);
    //     preForm.append("doj", $scope.BusinessCategory);
    //     preForm.append("businessCategoryId", $scope.StartDate);
    //     preForm.append("companyName", $scope.BookingAmount);
    //     preForm.append("addressLine1", $scope.ClientAmount);
    //     preForm.append("addressLine2", $scope.RefundAmount);
    //     preForm.append("cityMasterId", $scope.CGSTPercent);
    //     preForm.append("zipcode", $scope.SGSTPercent);
    //     preForm.append("mapLocation", $scope.IGSTPercent);
    //     preForm.append("phone", $scope.BusinessCategory);
    //     preForm.append("fax", $scope.StartDate);
    //     preForm.append("url", $scope.BookingAmount);
    //     preForm.append("supportEmail", $scope.ClientAmount);
    //     preForm.append("adminEmail", $scope.RefundAmount);
    //     preForm.append("adminMobile", $scope.CGSTPercent);
    //     preForm.append("adminPassword", $scope.SGSTPercent);
    //     preForm.append("gstinNo", $scope.IGSTPercent);
    //     preForm.append("paNo", $scope.ClientAmount);
    //     preForm.append("bankName", $scope.RefundAmount);
    //     preForm.append("bankBranchName", $scope.CGSTPercent);
    //     preForm.append("bankAddress", $scope.SGSTPercent);
    //     preForm.append("bankCity", $scope.IGSTPercent);
    //     preForm.append("bankState", $scope.BusinessCategory);
    //     preForm.append("bankAccountNo", $scope.StartDate);
    //     preForm.append("bankIfscCode", $scope.BookingAmount);
    //     preForm.append("companyType", $scope.ClientAmount);
    //     preForm.append("personName", $scope.RefundAmount);
    //     preForm.append("weekStartDay", $scope.CGSTPercent);
    //     preForm.append("cancellationPolicy", $scope.SGSTPercent);
    //     preForm.append("companyHtmlPage", $scope.IGSTPercent);
    //     preForm.append("registrationValidUpto", $scope.IGSTPercent);
    //     if ($scope.Id != "0") {

    //         $http({
    //             url: imageroute + "/admin/updateCompanyMaster",
    //             method: "POST",
    //             data: preForm,
    //             transformRequest: angular.identity,
    //             headers: { "Content-Type": undefined, "Process-Data": false },
    //         }).then(function(response) {
    //                 if (response.data.Data == 1) {
    //                     alert("Business Category Saved!");
    //                     $("#modal-lg").modal("toggle");
    //                     $scope.GetBusinessCategoryType();

    //                 } else {
    //                     $scope.btnsave = false;
    //                     alert("Unable to Save Business Category");
    //                 }
    //             },
    //             function(error) {
    //                 console.log(error);
    //                 $scope.btnsave = false;
    //             }
    //         );
    //     } else {
    //         $http({
    //             url: imageroute + "/admin/addCompanyMaster",
    //             method: "POST",
    //             data: preForm,
    //             transformRequest: angular.identity,
    //             headers: { "Content-Type": undefined, "Process-Data": false },
    //         }).then(function(response) {
    //                 if (response.data.Data == 1) {
    //                     alert("Business Category Saved!");
    //                     $("#modal-lg").modal("toggle");
    //                     $scope.GetBusinessCategoryType();

    //                 } else {
    //                     $scope.btnsave = false;
    //                     alert("Unable to Save Business Category");
    //                 }
    //             },
    //             function(error) {
    //                 console.log(error);
    //                 $scope.btnsave = false;
    //             }
    //         );
    //     }
    // }

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
                    $scope.BusinessCategoryList = response.data.Data;

                } else {
                    $scope.BusinessCategoryList = [];
                }
            },
            function(error) {
                console.log("Insternal Server");
            }
        );
    }
    $scope.GetBusinessCategoryType();

    $scope.GetCity = function() {
        $http({
            url: imageroute + "/admin/getCityMaster",
            method: "POST",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.CityList = response.data.Data;

                } else {
                    $scope.CityList = [];
                }
            },
            function(error) {
                console.log("Insternal Server");
            }
        );
    }
    $scope.GetCity();

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
    $scope.GetCompany();

    $scope.DeleteData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        if (result) {
            $http({
                url: imageroute + "/admin/deleteCompanyMaster",
                method: "POST",
                cache: false,
                data: { id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.Data == 1) {
                        alert("Delete Successfully !");
                        $scope.GetCompany();

                    } else {
                        alert("Data Not deleted !");
                        $scope.GetCompany();
                    }
                },
                function(error) {
                    console.log("Insternal Server");
                }
            );
        }
    }

    $scope.GetBankData = function(data) {
        console.log(data.bank);
        $scope.BankDataList = data.bank;

    }

    $scope.GetLoginData = function(data) {
        $scope.LoginDataList = [];
        $scope.LoginDataList.push(data);

    }

});