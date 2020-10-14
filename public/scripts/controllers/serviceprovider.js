app.controller('ServiceProviderController', function($scope, $http) {
    $scope.model = {};
    $scope.companyList = [];
    $scope.inventories = [];
    $scope.RateTypeList = ['Fixed', 'Variable'];
    $scope.serviceProviders = [];
    $scope.CompanyId = undefined;
    $scope.loading = false;

    $scope.onInit = function() {
        if (sessionStorage.getItem('Role') == 'company') {
            $scope.CompanyId = sessionStorage.getItem('SessionId')
        }
        console.log('hello')
        $scope.loadServiceProvider();
        $scope.loadCompany();   
    }
    $scope.loadServiceProvider = function() {
        $scope.loading = true;
        $http({
            url: imageroute + "/admin/getServiceProvider",
            method: "POST",
            cache: false,
            data: {companyId: $scope.CompanyId},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                $scope.loading = false;
                if (response.data.Data.length) {
                    $scope.serviceProviders = response.data.Data;
                } else {
                    $scope.serviceProviders = [];
                }
            },
            function(error) {
                $scope.loading = false;
                console.log("Insternal Server");
            }
        );
    }
    $scope.loadCompany = function() {
            $scope.loading = true;
            $http({
                url: imageroute + "/admin/getCompanyMaster",
                method: "POST",
                cache: false,
                data: {_id: $scope.CompanyId},
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    $scope.loading = false;
                    if (response.data.Data.length >= 1) {
                        $scope.companyList = response.data.Data;
                    } else {
                        $scope.CompanyList = [];
                    }
                },
                function(error) {
                    $scope.loading = false;
                    console.log("Insternal Server");
                }
            );
        
    }
    $scope.loadInventory = function(companyId) {
        if (companyId) {
            $scope.loading = true;
            $http({
                url: imageroute + "/admin/getInventoryByCompanyId",
                method: "POST",
                cache: false,
                data: {companyId},
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    $scope.loading = false;
                    if (response.data.Data.length >= 1) {
                        $scope.inventories = response.data.Data;
                    } else {
                        $scope.inventories = [];
                    }
                },
                function(error) {
                    $scope.loading = false;
                    console.log("Insternal Server");
                }
            );
        }

    }

    $scope.onInverntorySelect = function(inventory) {
        // $scope.model.serviceProvidername = inventory
        $scope.model.appointmentMinutes = inventory.appointmentMinutes
        $scope.model.rateType = inventory.rateType;
        $scope.model.rateAmt = inventory.rateAmt;
    }

    $scope.onSubmit = function(){
        $scope.loading = true;
        $http({
            url: imageroute + "/admin/addServiceProvider",
            method: "POST",
            cache: false,
            data: this.model,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
            if (response.data.IsSuccess == 1) {
                alert("Service Provider Created!");
                $("#modal-lg").modal("toggle");
                $scope.loadServiceProvider();

            } else {
                $scope.loading = false;
                alert("Unable to Create Service provider");
            }
        },
        function(error) {
            console.log(error);
            $scope.loading = false;
        }
    );
    }

    $scope.EditData = function(serviceProvider) {   
        $scope.loadCompany();
        $scope.loadInventory(serviceProvider.companyId._id)
        let providerObj = Object.assign(JSON.parse(JSON.stringify(serviceProvider)), {companyId: serviceProvider.companyId._id, inventoryId: serviceProvider.inventoryId._id})
        $scope.model = JSON.parse(JSON.stringify(providerObj));
        setTimeout(function () {
            $("#modal-lg").modal("toggle");
        }, 350)
    }

    $scope.DeleteData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        if (result) {
            $http({
                url: imageroute + "/admin/removeInventory",
                method: "POST",
                cache: false,
                data: { id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.IsSuccess) {
                        alert("Delete Successfully !");
                        $scope.loadServiceProvider();

                    } else {
                        alert("Data Not deleted !");
                    }
                },
                function(error) {
                    console.log("Internal Server");
                }
            );
        }
    }
    $scope.onInit();
})