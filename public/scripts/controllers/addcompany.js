app.controller('AddCompanyController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.BusinessCategoryList = [];
    $scope.MessageList = ['Prop', 'Patnership', 'Pvt.Ltd', 'LLp', 'LTD'];
    $scope.CityList = [];
    $scope.BankDataList = [];


    $scope.submitCompany = function() {
        var preForm = new FormData();
        angular.forEach($scope.files, function(file) {
            preForm.append("personPhoto", file);
            preForm.append("aadharCard", file);
            preForm.append("panCard", file);
            preForm.append("cancelledCheque", file);
            preForm.append("companyLogo", file);
        });
        preForm.append("id", $scope.Id);
        preForm.append("doj", $scope.DOJ);
        preForm.append("businessCategoryId", $scope.BusinessCategoryId);
        preForm.append("companyName", $scope.CompanyName);
        preForm.append("addressLine1", $scope.Address1);
        preForm.append("addressLine2", $scope.Address2);
        preForm.append("cityMasterId", $scope.CityId);
        preForm.append("zipcode", $scope.Zipcode);
        preForm.append("mapLocation", $scope.MapLocation);
        preForm.append("phone", $scope.Phone);
        preForm.append("fax", $scope.Fax);
        preForm.append("url", $scope.Url);
        preForm.append("supportEmail", $scope.SupportEmail);
        preForm.append("adminEmail", $scope.AdminEmail);
        preForm.append("adminMobile", $scope.AdminMobile);
        preForm.append("adminPassword", $scope.AdminPassword);
        preForm.append("gstinNo", $scope.GstinNo);
        preForm.append("paNo", $scope.PancardNo);
        preForm.append("bankName", $scope.BankName);
        preForm.append("bankBranchName", $scope.BankBranchName);
        preForm.append("bankAddress", $scope.BankAddress);
        preForm.append("bankCity", $scope.BankCity);
        preForm.append("bankState", $scope.BankState);
        preForm.append("bankAccountNo", $scope.BankAccountNo);
        preForm.append("bankIfscCode", $scope.BankIFSCCode);
        preForm.append("companyType", $scope.CompanyType);
        preForm.append("personName", $scope.PersonName);
        preForm.append("weekStartDay", $scope.WeekStartDay);
        preForm.append("cancellationPolicy", $scope.CancellationPolicy);
        preForm.append("companyHtmlPage", $scope.CompanyHtmlPage);
        preForm.append("registrationValidUpto", $scope.RegistrationValidUpto);

        if ($scope.Id != "0") {

            $http({
                url: imageroute + "/admin/updateCompanyMaster",
                method: "POST",
                data: preForm,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false },
            }).then(function(response) {
                    if (response.data.Data == 1) {
                        alert("Company Saved!");
                        $("#modal-lg").modal("toggle");
                        $scope.GetBusinessCategoryType();

                    } else {
                        $scope.btnsave = false;
                        alert("Unable to Save Company");
                    }
                },
                function(error) {
                    console.log(error);
                    $scope.btnsave = false;
                }
            );
        } else {
            $http({
                url: imageroute + "/admin/addCompanyMaster",
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