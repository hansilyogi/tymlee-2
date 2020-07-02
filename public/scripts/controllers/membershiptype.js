app.controller('MembershipController', function($scope) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.submitPolice = function() {
        var preForm = new FormData();
        angular.forEach($scope.files, function(file) {
            preForm.append("image", file);
        });
        preForm.append("id", $scope.Id);
        preForm.append("id", $scope.MemberType);
        preForm.append("id", $scope.RegistrationFee);
        preForm.append("id", $scope.CGSTPercent);
        preForm.append("id", $scope.SGSTPercent);
        preForm.append("id", $scope.IGSTPercent);
        preForm.append("id", $scope.BenefitList);



        $http({
            url: imageroute + "admin/policeverification",
            method: "POST",
            data: preForm,
            transformRequest: angular.identity,
            headers: { "Content-Type": undefined, "Process-Data": false },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("Police Verification Image Saved!");
                    $scope.CourierCounter();
                    $("#policeModal").modal("toggle");
                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save Police Verification Img");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );
    }
});