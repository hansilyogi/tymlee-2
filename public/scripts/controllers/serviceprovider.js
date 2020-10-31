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
            $scope.CompanyId = sessionStorage.getItem('SessionId');
            $scope.isTableBooking = sessionStorage.getItem("t") == 'Table';
            $scope.loadInventory($scope.CompanyId)
            $scope.model.companyId = $scope.CompanyId;
        }
        $scope.loadServiceProvider();
        // $scope.loadCompany();   
        
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
                data: {companyId , multipleServiceProviderRequired: true},
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

    $scope.onInverntorySelect = function() {
        // $scope.model.serviceProvidername = inventory
        let inventory = $scope.inventories.filter(item => item._id == $scope.model.inventoryId)
        if (inventory && inventory.length) {
            $scope.model.appointmentMinutes = inventory[0].appointmentMinutes
            $scope.model.rateType = inventory[0].rateType;
            $scope.model.rateAmt = inventory[0].rateAmt;
            $scope.model.totalTable = inventory[0].tableCounts;
        }
        $scope.model.isTableBooking = $scope.isTableBooking;
        console.log($scope.model)
    }

    $scope.onSubmit = function(){
        console.log($scope.model)
        debugger
        $scope.loading = true;
        $http({
            url: imageroute + "/admin/addServiceProvider",
            method: "POST",
            cache: false,
            data: this.model,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
            if (response.data.IsSuccess == 1) {
                $scope.model = {};
                $scope.model.companyId = $scope.CompanyId;
                alert("Service Provider saved!");
                $("#modal-lg").modal("toggle");
                $scope.loadServiceProvider();
            } else {
                $scope.loading = false;
                alert(response.data.Message || "Unable to Create Service provider");
            }
        },
        function(error) {
            console.log(error);
            $scope.loading = false;
        }
    );
    }

    $scope.EditData = function(serviceProvider) {   
        // $scope.loadCompany();
        $scope.loadInventory(serviceProvider.companyId._id)
        let providerObj = Object.assign(JSON.parse(JSON.stringify(serviceProvider)), {companyId: serviceProvider.companyId._id, inventoryId: serviceProvider.inventoryId._id})
        $scope.model = JSON.parse(JSON.stringify(providerObj));
        setTimeout(function () {
            $("#modal-lg").modal("toggle");
        }, 350)
    }

    $scope.verifyDelete = function(id) {
            $http({
                url: imageroute + "/admin/removeServiceProvider",
                method: "POST",
                cache: false,
                data: { id: id, allowDelete: false },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.allowDelete) {
                        $scope.DeleteData(id);

                    } else {
                        alert(response.data.Message || "Data Not deleted !");
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
                url: imageroute + "/admin/removeServiceProvider",
                method: "POST",
                cache: false,
                data: { id: id, allowDelete: true },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.IsSuccess) {
                        alert("Delete Successfully !");
                        $scope.loadServiceProvider();

                    } else {
                        alert(response.data.Message || "Data Not deleted !");
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