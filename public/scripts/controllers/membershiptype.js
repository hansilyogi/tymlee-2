app.controller('MembershipController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.MessageList = ['Free', 'Standard', 'Enterprise'];
    $scope.MemberType = $scope.MessageList[0];
    $scope.submitMemberShipType = function() {
        var preForm = new FormData();
        angular.forEach($scope.files, function(file) {
            preForm.append("registrationIcon", file);
        });
        preForm.append("id", $scope.Id);
        preForm.append("membershipType", $scope.MemberType);
        preForm.append("registrationFee", $scope.RegistrationFee);
        preForm.append("csgtPercent", $scope.CGSTPercent);
        preForm.append("sgstPercent", $scope.SGSTPercent);
        preForm.append("igstPercent", $scope.IGSTPercent);
        preForm.append("benefitList", $scope.BenefitList);
        if ($scope.Id != "0") {

            $http({
                url: imageroute + "/admin/UpdateMembershipType",
                method: "POST",
                data: preForm,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false },
            }).then(function(response) {
                    if (response.data.Data == 1) {
                        alert("Membership Type Saved!");
                        $("#modal-lg").modal("toggle");
                        $scope.GetMembershipType();

                    } else {
                        $scope.btnsave = false;
                        alert("Unable to Save Membership Type");
                    }
                },
                function(error) {
                    console.log(error);
                    $scope.btnsave = false;
                }
            );
        } else {
            $http({
                url: imageroute + "/admin/addMembershipType",
                method: "POST",
                data: preForm,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false },
            }).then(function(response) {
                    if (response.data.Data == 1) {
                        alert("Membership Type Saved!");
                        $("#modal-lg").modal("toggle");
                        $scope.GetMembershipType();

                    } else {
                        $scope.btnsave = false;
                        alert("Unable to Save Membership Type");
                    }
                },
                function(error) {
                    console.log(error);
                    $scope.btnsave = false;
                }
            );
        }
    }

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
    $scope.GetMembershipType();


    $scope.DeleteData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        if (result) {
            $http({
                url: imageroute + "/admin/DeleteMembershipType",
                method: "POST",
                cache: false,
                data: { id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.Data == 1) {
                        alert("Delete Successfully !");
                        $scope.GetMembershipType();

                    } else {
                        alert("Data Not deleted !");
                        $scope.GetMembershipType();
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
        $scope.MemberType = data.membershipType;
        $scope.RegistrationFee = data.registrationFee;
        $scope.CGSTPercent = data.csgtPercent;
        $scope.SGSTPercent = data.sgstPercent;
        $scope.IGSTPercent = data.igstPercent;
        $scope.BenefitList = data.benefitList;
    }


    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.MemberType = "";
        $scope.RegistrationFee = "";
        $scope.CGSTPercent = "";
        $scope.SGSTPercent = "";
        $scope.IGSTPercent = "";
        $scope.BenefitList = "";
        angular.element("input[type='file']").val(null);
    }
    $scope.Clear();
});