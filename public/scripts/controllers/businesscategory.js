app.controller('BusinessCategoryController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.MessageList = ['Restaurant', 'Spa/Saloon', 'Beauty Parlour', 'Hospitals'];

    $scope.submitBusinessCategory = function() {
        let trimFileName = ($scope.BusinessCategory).split(" ").join("");
        let imgURL = `${assets_image_url}/${trimFileName}/businessCategory`;
        let postURL = $scope.Id ? '/admin/updateCategoryMaster' : '/admin/addCategoryMaster';
        if ($scope.files) {
            var preForm = new FormData();
            angular.forEach($scope.files, function(file) {
                preForm.append("upload", file);
            });
            function uploadFiles() {
                return $http({
                        url: imgURL,
                        method: "POST",
                        data: preForm,
                        transformRequest: angular.identity,
                        headers: { "Content-Type": undefined, "Process-Data": false },
                    })
            }
              uploadFiles().then(function(response) {
                    let reqData = {
                        id : $scope.Id || undefined,
                        businessCategoryName: $scope.BusinessCategory,
                        startDate : $scope.StartDate,
                        bookingAmt: $scope.BookingAmount,
                        clientAmt: $scope.ClientAmount,
                        refundAmt: $scope.RefundAmount,
                        csgtPercent: $scope.CGSTPercent,
                        sgstPercent: $scope.SGSTPercent,
                        igstPercent: $scope.IGSTPercent,
                        businessIcon: response.data.result ? `${assets_server_url}/${response.data.result}` : undefined
                    }
                    
                    $scope.saveBusiness(postURL, reqData);
              }, function(reason) {
                  $scope.btnsave = false;
                 alert("Unable to Save Business Category");
              });
        } else {
            let reqData = {
                id : $scope.Id || undefined,
                businessCategoryName: $scope.BusinessCategory,
                startDate : $scope.StartDate,
                bookingAmt: $scope.BookingAmount,
                clientAmt: $scope.ClientAmount,
                refundAmt: $scope.RefundAmount,
                csgtPercent: $scope.CGSTPercent,
                sgstPercent: $scope.SGSTPercent,
                igstPercent: $scope.IGSTPercent,
                businessIcon: undefined
            }
            $scope.files = undefined;
            $scope.saveBusiness(postURL, reqData);
        }
     }
     $scope.saveBusiness = function(url, data){
        $http({
            url: url,
            method: "POST",
            data: data,
            // transformRequest: angular.identity,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    $scope.files = undefined;
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
    $scope.GetBusinessCategoryType();


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
                        $scope.GetBusinessCategoryType();

                    } else {
                        alert("Data Not deleted !");
                        $scope.GetBusinessCategoryType();
                    }
                },
                function(error) {
                    console.log("Internal Server");
                }
            );
        }
    }

    $scope.EditData = function(data) {
        $('#modal-lg').modal();
        console.log(data);
        $scope.Id = data._id;
        $scope.BusinessCategory = data.businessCategoryName;
        $scope.StartDate = new Date(data.startDate);
        $scope.BookingAmount = data.bookingAmt;
        $scope.ClientAmount = data.clientAmt;
        $scope.RefundAmount = data.refundAmt;
        $scope.CGSTPercent = data.csgtPercent;
        $scope.SGSTPercent = data.sgstPercent;
        $scope.IGSTPercent = data.igstPercent;
    }


    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.BusinessCategory = "";
        $scope.StartDate = "";
        $scope.BookingAmount = "";
        $scope.ClientAmount = "";
        $scope.RefundAmount = "";
        $scope.CGSTPercent = "";
        $scope.SGSTPercent = "";
        $scope.IGSTPercent = "";
        angular.element("input[type='file']").val(null);
    }
    $scope.Clear();
});