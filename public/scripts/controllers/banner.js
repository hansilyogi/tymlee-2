app.controller('BannerController', function ($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];

    $scope.submitBanner = function () {
        try {
            if ($scope.files) {
                let trimFileName = ($scope.Title).split(" ").join("");
                var preForm = new FormData();
                angular.forEach($scope.files, function (file) {
                    preForm.append("upload", file);
                });
                // preForm.append("id", $scope.Id);
                // preForm.append("title", $scope.Title);
                // preForm.append("description", $scope.Description);
                // preForm.append("expiryDate", $scope.ExpiryDate);
                let imgURL = `${assets_image_url}/${trimFileName}/banner`;
                // $http({
                //     url: imgURL,
                //     method: "POST",
                //     data: preForm,
                //     transformRequest: angular.identity,
                //     headers: { "Content-Type": undefined, "Process-Data": false },
                // })
                fetch(imgURL, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    // mode: 'cors', // no-cors, *cors, same-origin
                    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    // credentials: 'same-origin', // include, *same-origin, omit
                    // headers: {
                    //     "Content-Type": 'multipart/form-data', "Process-Data": false
                    // },
                    // redirect: 'follow', // manual, *follow, error
                    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: preForm
                })
                    .then(function (result) {
                        if (result.ok) { console.log('tru') }
                        result.json().then(function (response) {
                            if (response && response.result) {
                                $scope.files = undefined
                                let data = {
                                    id: $scope.Id,
                                    title: $scope.Title,
                                    description: $scope.Description,
                                    expiryDate: $scope.ExpiryDate,
                                    imagePath: `${assets_server_url}/${response.result}`,
                                };
                                $scope.updateBannerInfo(data)
                            } else {
                                $scope.btnsave = false;
                                console.log(response)
                                alert('File not Found')
                            }
                        })
                    },
                        function (error) {
                            console.log(error);
                            $scope.btnsave = false;
                        }
                    );
            } else {
                let data = {
                    id: $scope.Id,
                    title: $scope.Title,
                    description: $scope.Description,
                    expiryDate: $scope.ExpiryDate,
                    // imagePath: `${assets_server_url}/${response.data.result}`,
                };
                $scope.updateBannerInfo(data)
            }

            //     $http({
            //         url: imageroute + "/admin/addBanner",
            //         method: "POST",
            //         data: {
            //             id: $scope.Id,
            //             title: $scope.Title,
            //             description: $scope.Description,
            //             expiryDate: $scope.ExpiryDate,
            //             imagePath: `${assets_server_url}/${response.data.result}`,
            //         },
            //         // transformRequest: angular.identity,
            //         headers: { "Content-Type": "application/json; charset=UTF-8" },
            //         // headers: { "Content-Type": undefined, "Process-Data": false },
            //     }).then(function (response) {
            //         if (response.data.Data == 1) {
            //             alert("Banner Saved!");
            //             $("#modal-lg").modal("toggle");
            //             $scope.GetBanner();

            //         } else {
            //             $scope.btnsave = false;
            //             alert("Unable to Save Banner");
            //         }
            //     },
            //         function (error) {
            //             console.log(error);
            //             $scope.btnsave = false;
            //         }
            //     );
            // },
            //     function (error) {
            //         console.log(error);
            //         $scope.btnsave = false;
            //     }
            // );
        } catch (err) {
            $scope.btnsave = false;
            console.log(err)
        }
    }
    $scope.updateBannerInfo = function( data) {
        $http({
            url: imageroute + "/admin/addBanner",
            method: "POST",
            data: data,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function (response) {
            if (response.data.Data == 1) {
                alert("Banner Saved!");
                $("#modal-lg").modal("toggle");
                $scope.GetBanner();

            } else {
                $scope.btnsave = false;
                alert("Unable to Save Banner");
            }
        })
        .catch(function(error) {
            console.log(error);
                    $scope.btnsave = false;  
        })
    };
    
    $scope.GetBanner = function () {
        $http({
            url: imageroute + "/admin/getBanner",
            method: "POST",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function (response) {
                if (response.data.Data.length >= 1) {
                    $scope.DataList = response.data.Data;

                } else {
                    $scope.DataList = [];
                }
            },
            function (error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.GetBanner();


    $scope.DeleteData = function (id) {
        var result = confirm("Are you sure you want to delete this ?");
        if (result) {
            $http({
                url: imageroute + "/admin/deleteBanner",
                method: "POST",
                cache: false,
                data: { id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function (response) {
                    if (response.data.Data == 1) {
                        alert("Delete Successfully !");
                        $scope.GetBanner();

                    } else {
                        alert("Data Not deleted !");
                        $scope.GetBanner();
                    }
                },
                function (error) {
                    console.log("Internal Server");
                }
            );
        }
    }

    $scope.EditData = function (data) {
        $('#modal-lg').modal();
        $scope.Id = data._id;
        $scope.Title = data.title;
        $scope.Description = data.description;
        $scope.ExpiryDate = new Date(data.expiryDate);
    }


    $scope.Clear = function () {
        $scope.Id = 0;
        $scope.Title = "";
        $scope.Description = "";
        $scope.ExpiryDate = "";
        angular.element("input[type='file']").val(null);
    }
    $scope.Clear();
});