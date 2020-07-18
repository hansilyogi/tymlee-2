app.controller('AddCompanyController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.BusinessCategoryList = [];
    $scope.MemberShipType = [];
    $scope.PayThrough = ['UPI', 'Credit Card', 'Debit Card', 'NetBanking'];
    $scope.MessageList = ['Prop', 'Patnership', 'Pvt.Ltd', 'LLp', 'LTD'];
    $scope.CityList = [];
    $scope.BankDataList = [];


    $scope.submitCompany = function() {
        var preForm = new FormData();

        // preForm.append("personPhoto", $scope.PersonImage);
        // preForm.append("aadharCard", $scope.AadharCard);
        // preForm.append("panCard", $scope.PanCard);
        // preForm.append("cancelledCheque", $scope.CancelledCheque);
        // preForm.append("companyLogo", $scope.CompanyLogo);
        if ($scope.PersonImage != null && $scope.PersonImage.length > 0)
            preForm.append('personPhoto', $scope.PersonImage[0]);

        if ($scope.AadharCard != null && $scope.AadharCard.length > 0)
            preForm.append('aadharCard', $scope.AadharCard[0]);

        if ($scope.PanCard != null && $scope.PanCard.length > 0)
            preForm.append('panCard', $scope.PanCard[0]);

        if ($scope.CancelledCheque != null && $scope.CancelledCheque.length > 0)
            preForm.append('cancelledCheque', $scope.CancelledCheque[0]);

        if ($scope.CompanyLogo != null && $scope.CompanyLogo.length > 0)
            preForm.append('companyLogo', $scope.CompanyLogo[0]);

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


        $http({
            url: imageroute + "/admin/addCompanyMaster",
            method: "POST",
            data: preForm,
            transformRequest: angular.identity,
            headers: { "Content-Type": undefined, "Process-Data": false },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("Company Saved!");
                    $("#modal-lg").modal("toggle");
                    $scope.Clear();

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


    $scope.GetMembershipType = function() {
        $http({
            url: imageroute + "/admin/MembershipType",
            method: "POST",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.MemberShipType = response.data.Data;

                } else {
                    $scope.MemberShipType = [];
                }
            },
            function(error) {
                console.log("Insternal Server");
            }
        );
    }
    $scope.GetMembershipType();

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

    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.DOJ = "";
        $scope.BusinessCategoryId = "";
        $scope.CompanyName = "";
        $scope.Address1 = "";
        $scope.Address2 = "";
        $scope.CityId = "";
        $scope.Zipcode = "";
        $scope.MapLocation = "";
        $scope.Phone = "";
        $scope.Fax = "";
        $scope.Url = "";
        $scope.SupportEmail = "";
        $scope.AdminEmail = "";
        $scope.AdminMobile = "";
        $scope.AdminPassword = "";
        $scope.GstinNo = "";
        $scope.PancardNo = "";
        $scope.BankName = "";
        $scope.BankBranchName = "";
        $scope.BankAddress = "";
        $scope.BankCity = "";
        $scope.BankState = "";
        $scope.BankAccountNo = "";
        $scope.BankIFSCCode = "";
        $scope.CompanyType = "";
        $scope.PersonName = "";
        $scope.WeekStartDay = "";
        $scope.CancellationPolicy = "";
        $scope.CompanyHtmlPage = "";
        $scope.RegistrationValidUpto = "";
    }
    $scope.Clear();

});