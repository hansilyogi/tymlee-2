// 'use strict';
angular.module("TimelyModule")
.controller('VendorProfileController', function ($scope, $http, $q) {
    $scope.vendorProfile = {};
    $scope.model = {};
    $scope.WeekStartDayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $scope.MessageList = ['Proprietorship', 'Partnership', ' Private Limited', ' LLP', 'Limited'];
    $scope.color = {
        'background-color': 'grey'
    };
    $scope.data = {
        PersonImage : null,
        AadharCard : null,
        PanCard : null,
        CancelledCheque :null,
        CompanyLogo : null,}
    $scope.tabs = [
        { id: 1, name: 'Vendor Detail', key:"vendorInfo", active: false },
        { id: 1, name: 'Contact Us', key:"contactus", active: false },
        { id: 2, name: 'Bank Detail', key:"bank", active: false },
        { id: 3, name: 'KYC', key:'kyc',  active: false },
        { id: 4, name: 'Admin Login', key:"adminlogin", active: false },
        { id: 5, name: 'Notes', key:"notes", active: false }  
    ];
    $scope.selectedTab = $scope.tabs[0];

    $scope.changeTab = function(tab) {
        $scope.selectedTab = tab;
    }

    $scope.getVendorInfo = function(id) {
        $http({
            url: imageroute + "/admin/getCompanyMaster",
            method: "POST",
            cache: false,
            data: {_id: id},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.IsSuccess) {
                    $scope.model = response.data.Data[0];
                    $scope.vendorProfile = response.data.Data[0];
                    $scope.model.doj = new Date($scope.model.doj);
                    $scope.model.registrationValidUpto = new Date($scope.model.registrationValidUpto);
                    $scope.model.businessCategoryId = $scope.model.businessCategoryId._id || $scope.model.businessCategoryId;
                    $scope.model.cityMasterId = $scope.model.cityMasterId._id || $scope.model.cityMasterId;
                    $scope.model.companyType = $scope.model.companyType._id || $scope.model.companyType;
                    // $scope.model = Object.assign($scope.model, $scope.model.bank)
                    // console.log($scope.model)
                    
                } else {
                    $scope.DataList = {};
                }
            },
            function(error) {
                console.log("Internal Server");
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
                    $scope.BusinessCategoryList = response.data.Data;

                } else {
                    $scope.BusinessCategoryList = [];
                }
            },
            function(error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.GetCity = function() {
        $http({
            url: imageroute + "/admin/getCityMaster",
            method: "POST",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.CityList = response.data.Data;

                } else {
                    $scope.CityList = [];
                }
            },
            function(error) {
                console.log("Internal Server");
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
                    $scope.MemberShipTypeList = response.data.Data;

                } else {
                    $scope.MemberShipTypeList = [];
                }
            },
            function(error) {
                console.log("Internal Server");
            }
        );
    }

    $scope.submit = function() {
        let files = []
        if ($scope.data.PersonImage != null && $scope.data.PersonImage.length > 0)
            files.push({key: 'personPhoto', value: $scope.data.PersonImage[0]});
        
        if ($scope.data.AadharCard != null && $scope.data.AadharCard.length > 0)
            files.push({key:'aadharCard', value: $scope.data.AadharCard[0]});

        if ($scope.data.PanCard != null && $scope.data.PanCard.length > 0)
            files.push({key:'panCard', value: $scope.data.PanCard[0]});

        if ($scope.data.CancelledCheque != null && $scope.data.CancelledCheque.length > 0)
            files.push({key:'cancelledCheque',value: $scope.data.CancelledCheque[0]});

        if ($scope.data.CompanyLogo != null && $scope.data.CompanyLogo.length > 0)
            files.push({key:'companyLogo', value: $scope.data.CompanyLogo[0]});
        if (files && files.length) {
            var promise = companyFileUploader(files);
            promise.then(function(uploadResult) {
                uploadResult.forEach(i => {
                    return Object.assign($scope.model, {...i})
                })
                $scope.saveCompanyWithFile()
            }, function(reason) {
                alert('Unable to Upload the files!')
            });
        } else {
            $scope.saveCompanyWithFile()
        }
    }

    function companyFileUploader(data) {
            let promise = data.map((item) => {
                var preForm = new FormData();
                // preForm.append('key', item.value);
                preForm.append('upload', item.value);
                let innerDefer = $q.defer()
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
                        let data = {
                            imagePath: `customer/getImage/${result.data.data[0]._id}`,
                            attachment: result.data.data[0]._id
                        };
                        let attachmentkey = item.key + 'Attachment'
                        innerDefer.resolve({
                            [item.key]: `customer/getImage/${result.data.data[0]._id}`,
                            [attachmentkey]: result.data.data[0]._id
                        })
                    } else {
                        console.log('File not Found');
                    }
                },
                    function (error) {
                        innerDefer.reject(error)
                    }
                );
                return innerDefer.promise;
             })
             
            return Promise.all(promise)        
    }

    $scope.saveCompanyWithFile = function() {
        debugger
        let requestURL = $scope.model._id ? '/admin/updateCompanyMaster' : '/admin/addCompanyMaster'
        $http({
            url: imageroute + requestURL,
            method: "POST",
            data: this.model,
            // transformRequest: angular.identity,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                if (response.data.IsSuccess) {
                    $("#modal-lg-company").modal("toggle");
                    alert("Company Saved!");
                    $scope.model = {};
                    let companyId = sessionStorage.getItem("SessionId")
                    $scope.getVendorInfo(companyId);
                    // $scope.Clear();

                } else {
                    $scope.btnsave = false;
                    let message = response.data.Message || "Unable to Save Company";
                    alert(message);
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );
    }

    function onInit() {
        let companyId = sessionStorage.getItem("SessionId")
        $scope.getVendorInfo(companyId);
        $scope.GetMembershipType();
        $scope.GetBusinessCategoryType();
        $scope.GetCity();
    }
    onInit()
});