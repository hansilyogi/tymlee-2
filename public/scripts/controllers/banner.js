app.controller('BannerController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];

    $scope.submitBanner = function() {
        var preForm = new FormData();
        angular.forEach($scope.files, function(file) {
            preForm.append("image", file);
        });
        preForm.append("id", $scope.Id);
        preForm.append("title", $scope.Title);
        preForm.append("description", $scope.Description);

        $http({
            url: imageroute + "/admin/addBanner",
            method: "POST",
            data: preForm,
            transformRequest: angular.identity,
            headers: { "Content-Type": undefined, "Process-Data": false },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("Banner Saved!");
                    $("#modal-lg").modal("toggle");
                    $scope.GetBanner();

                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save Banner");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );

    }

    $scope.GetBanner = function() {
        $http({
            url: imageroute + "/admin/getBanner",
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
    $scope.GetBanner();


    $scope.DeleteData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        if (result) {
            $http({
                url: imageroute + "/admin/deleteBanner",
                method: "POST",
                cache: false,
                data: { id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.Data == 1) {
                        alert("Delete Successfully !");
                        $scope.GetBanner();

                    } else {
                        alert("Data Not deleted !");
                        $scope.GetBanner();
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
        $scope.Title = data.title;
        $scope.Description = data.description;
    }


    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.Title = "";
        $scope.Description = "";
        angular.element("input[type='file']").val(null);
    }
    $scope.Clear();
});