app.controller('ViewCompanyTransactionController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];

    // $scope.GetCompanyTransaction = function() {
    //     $http({
    //         url: imageroute + "/admin/getcustomer",
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
    // $scope.GetCompanyTransaction();

    // $scope.DeleteData = function(id) {
    //     var result = confirm("Are you sure you want to delete this ?");
    //     if (result) {
    //         $http({
    //             url: imageroute + "/admin/deleteCompanyMaster",
    //             method: "POST",
    //             cache: false,
    //             data: { id: id },
    //             headers: { "Content-Type": "application/json; charset=UTF-8" },
    //         }).then(
    //             function(response) {
    //                 if (response.data.Data == 1) {
    //                     alert("Delete Successfully !");
    //                     $scope.GetCompany();

    //                 } else {
    //                     alert("Data Not deleted !");
    //                     $scope.GetCompany();
    //                 }
    //             },
    //             function(error) {
    //                 console.log("Insternal Server");
    //             }
    //         );
    //     }
    // }

});