angular.module("TimelyModule")
    .controller('VendorBannersController', function ($scope, $http, $q, fileUploader) {
        $scope.isAdmin = true;
        $scope.banners = [];
        $scope.model = {};
        $scope.files = {};
        $scope.filterDataset = {};
        $scope.unitTypes = ['Weekly', 'Monthly'];

        //admin
        $scope.approved = function (data) {
            data.aprroveDate = moment().format()
            data.isApproved = true
            $http({
                url: imageroute + "/admin/vendorsBanners/approved",
                method: "PUT",
                data: data,
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(function (response) {
                if (response.data.IsSuccess) {
                    alert("Banner Approved Successfully!");
                    $scope.getBanners($scope.isAdmin ? undefined : $scope.sessionId);
                    $scope.model = {};
                } else {
                    $scope.btnsave = false;
                    alert(response.data.Message || "Unable get list of Banner!");
                }
            },
                function (error) {
                    alert(error.data.Message || "Unable get list of Banner!");
                    $scope.btnsave = false;
                }
            );
        }
        //vendors
        function submitData() {
            $http({
                url: imageroute + "/admin/vendorsBanners",
                method: "POST",
                data: $scope.model,
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(function (response) {
                if (response.data.IsSuccess) {
                    alert("Banner Created Successfully!");
                    $("#modal-vendor-lg").modal("toggle");
                    $scope.getBanners($scope.isAdmin ? undefined : $scope.sessionId);
                    $scope.model = {};
                } else {
                    $scope.btnsave = false;
                    alert(response.data.Message || "Unable get list of banners!");
                }
            },
                function (error) {
                    alert(error.data.Message || "Unable get list of banners!");
                    $scope.btnsave = false;
                }
            );
        }
        function getFilterData(filter) {
            let queryString = filter.bannerSize && filter.packageType ?
                "?bannerSize=" + filter.bannerSize + "&packageType=" + filter.packageType : ''
            return $http({
                url: imageroute + "/admin/vendorsBanners/get-filter-data" + queryString,
                method: "GET",
                // data: filter,
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            })
        }
        $scope.generateOrderNo = function () {
            return $http({
                url: imageroute + "/admin/new-vendor-order",
                method: "POST",
                data: {
                    amount: $scope.model.packageUnit,
                    currency: 'INR',
                    companyId: $scope.model.companyId,
                    // companyName :, 
                    isBanner: true
                },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            })
        }
        $scope.onSubmit = function () {
            if ($scope.model && !$scope.model.companyId && !$scope.isAdmin) {
                $scope.model.companyId = $scope.sessionId;
            }
            $scope.generateOrderNo($scope.model)
                .then(result => {
                    if (result && result.data.IsSuccess && result.data.Data.id) {
                        var options = {
                            "key": "rzp_test_a7VSGEl5KTwOCV", // Enter the Key ID generated from the Dashboard
                            "amount": result.data.Data.amount_due, //parseInt($scope.model.packageUnite), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                            "currency": "INR",
                            "name": "Banner Booking",
                            "description": `Booking Banner of ${$scope.model.bannerSize} size of ${$scope.model.packageType} type.`,
                            // "image": "https://example.com/your_logo",
                            "order_id": result.data.Data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                            "handler": function (response) {
                                $scope.model.payModalId = response.razorpay_payment_id;
                                $scope.model.transactionNo = response.razorpay_payment_id;
                                $scope.model.orderNo = response.razorpay_order_id
                                
                                if ($scope.files.bannerImage && $scope.files.bannerImage.length) {
                                    var preForm = new FormData();

                                    angular.forEach($scope.files.bannerImage, function (file) {
                                        preForm.append("upload", file);
                                    });

                                    var promise = fileUploader.upload(preForm);
                                    promise.then(function (result) {
                                        $scope.model.bannerImage = `customer/getImage/${result.data.data[0]._id}`,
                                            $scope.model.bannerAttachment = result.data.data[0]._id
                                        submitData()
                                    }, function (reason) {
                                        alert('Unable to Upload the files!');
                                        rzp1.close();
                                    });
                                }
                            },
                            "prefill": {
                                "name": "Gaurav Kumar",
                                "email": "gaurav.kumar@example.com",
                                "contact": "9999999999"
                            },
                            "notes": {
                                "address": "Razorpay Corporate Office"
                            },
                            "theme": {
                                "color": "#54aff3db"
                            }
                        };
    
                        var rzp1 = new Razorpay(options);
                        rzp1.on('payment.failed', function (response) {
                            alert(response.error.code);
                            alert(response.error.description);
                            alert(response.error.source);
                            alert(response.error.step);
                            alert(response.error.reason);
                            alert(response.error.metadata);
                        });
    
                        rzp1.open();
                        // e.preventDefault();
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            // if ($scope.files.offerImage && $scope.files.offerImage.length) {
            //     var preForm = new FormData();

            //     angular.forEach($scope.files.offerImage, function (file) {
            //         preForm.append("upload", file);
            //     });

            //     var promise = fileUploader.upload(preForm);
            //     promise.then(function (result) {
            //         $scope.model.image = `customer/getImage/${result.data.data[0]._id}`,
            //             $scope.model.attachment = result.data.data[0]._id
            //         submitData()
            //     }, function (reason) {
            //         alert('Unable to Upload the files!')
            //     });
            // } else {
            //     submitData()
            // }

        }

        $scope.getBanners = function (id) {
            $http({
                url: imageroute + "/admin/vendorsBanners",
                method: "GET",
                data: { vendorId: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(function (response) {
                if (response.data.isSuccess) {
                    $scope.banners = response.data.Data;
                } else {
                    $scope.btnsave = false;
                    alert("Unable get list of banners!");
                }
            },
                function (error) {
                    console.log(error);
                    $scope.btnsave = false;
                }
            );
        }
        //common
        $scope.closeModal = function () {
            $scope.model = {}
        }
        $scope.onEdit = function (data) {
            $scope.model = data;
            $scope.model.startDate = new Date(data.startDate);
            $scope.model.endDate = new Date(data.endDate);
        }
        function init() {
            $scope.isAdmin = sessionStorage.getItem("Role") == 'admin';
            $scope.sessionId = sessionStorage.getItem("SessionId");
            $scope.getBanners($scope.isAdmin ? undefined : $scope.sessionId);
            getFilterData({}).then(result => {
                if (result && result.data && result.data.isSuccess) {
                    $scope.filterDataset = result.data.Data
                }
            })
                .catch(err => {
                    console.log(err)
                })
        }

        $scope.getUniteValue = function () {
            if (!$scope.model.bannerSize || !$scope.model.packageType) {
                alert('Please select banner size and package Type');
                return
            }
            getFilterData({ bannerSize: $scope.model.bannerSize, packageType: $scope.model.packageType })
                .then(result => {
                    if (result && result.data && result.data.isSuccess) {
                        $scope.model.packageUnit = $scope.model.UnitType == 'Weekly' ? result.data.Data.weekPrice : result.data.Data.monthPrice;
                    }
                    else {
                        alert(err.Message || 'Banner is not available, please choose other size and type!')
                    }
                })
                .catch(err => {
                    alert(err.Message || 'Banner is not available, please choose other size and type!')
                })
        }

        $scope.delete = function (bannerId) {
            let _confirm = confirm("Are you sure you want to delete this ?");
            if (_confirm) {
                $http({
                    url: imageroute + "/admin/vendorsBanners/" + bannerId,
                    method: "delete",
                    // data: data,
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                }).then(result => {
                    if (result && result.data && result.data.IsSuccess) {
                        alert("Offer deleted successfully!");
                        $scope.getBanners($scope.isAdmin ? undefined : $scope.sessionId);
                    } else {
                        alert(result.data.Message || "Unable delete the offer!");
                    }
                }).catch(err => {
                    alert(err.data.Message || "Unable delete banner!");
                })
            }
        }

        $scope.onStartDateChange = function() {
            if (moment($scope.model.startDate).isSameOrBefore(moment())) {
                alert('Start Date should be greater than todays date!')
                $scope.model.startDate = null;
                return false
            } 
            $scope.model.endDate = $scope.model.UnitType == 'Weekly' ? new Date(moment($scope.model.startDate).add('1', 'weeks').format()) : new Date(moment($scope.model.startDate).add('1', 'months').format())
        }
        init()
    })
