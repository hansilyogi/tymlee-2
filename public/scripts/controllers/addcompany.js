app.controller('AddCompanyController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.BusinessCategoryList = [];
    $scope.MessageList = ['Prop', 'Patnership', 'Pvt.Ltd', 'LLp', 'LTD'];
    $scope.CityList = [];
    $scope.BankDataList = [];

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