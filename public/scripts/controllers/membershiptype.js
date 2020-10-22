app.controller('MembershipController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = null;
    $scope.DataList = [];
    $scope.MessageList = ['Free', 'Standard', 'Enterprise'];
    $scope.MemberType = $scope.MessageList[0];

    $scope.add_type = function() {
        if($scope.adding != null){
        $scope.MessageList.push($scope.adding);
        $scope.MessageList.append($scope.adding);
        }
    };

    $scope.submitMemberShipType = function() {
        var preForm = new FormData();
        angular.forEach($scope.files, function(file) {
            preForm.append("upload", file);
        });

        let data = {
            id: $scope.Id,
            membershipType: $scope.MemberType,
            csgtPercent: $scope.CGSTPercent,
            sgstPercent: $scope.SGSTPercent,
            igstPercent: $scope.IGSTPercent,
            benefitList:$scope.BenefitList,
            registrationFee: $scope.RegistrationFee
        };

        if ($scope.files && $scope.files.length) {
            $http({
                url: imageroute + "/customer/uploader",
                method: "POST",
                data: preForm,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false },
            })
                .then(function (result) {
                    if (result && result.data && result.data.status) {
                        $scope.files = undefined
                        data.registrationIcon = `customer/getImage/${result.data.data[0]._id}`;
                        data.attachment = result.data.data[0]._id;
                        $scope.updateMembershipData(data)
                    } else {
                        $scope.btnsave = false;
                        alert('File not Found');
                    }
                },
                    function (error) {
                        console.log(error);
                        $scope.btnsave = false;
                    }
                );
        } else {
            $scope.updateMembershipData(data)
        }
    }

    $scope.updateMembershipData = function(data) {
        let actionUrl = data.id ? '/admin/UpdateMembershipType' : '/admin/addMembershipType'
        $http({
            url: imageroute + actionUrl,
            method: "POST",
            data: data,
            // transformRequest: angular.identity,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("Membership Type Saved!");
                    $("#modal-lg").modal("toggle");
                    $scope.GetMembershipType();

                } else {
                    $scope.btnsave = false;
                    alert(response.data.Message || "Unable to Save Membership Type");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );
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
                console.log("Internal Server");
            }
        );
    }
    $scope.GetMembershipType();
    
    $scope.verifyDelete = function(id) {
        $http({
            url: imageroute + "/admin/DeleteMembershipType",
            method: "POST",
            cache: false,
            data: { id: id, allowDelete: false },
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.allowDelete) {
                    $scope.DeleteData(id)
                } else {
                    alert(response.data.Message || "Data Not deleted !");
                    $scope.GetMembershipType();
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
                        alert(response.data.Message || "Data Not deleted !");
                        $scope.GetMembershipType();
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