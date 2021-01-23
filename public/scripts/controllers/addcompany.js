app.controller('AddCompanyController', function($scope, $http, $q) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.BusinessCategoryList = [];
    $scope.MemberShipTypeList = [];
    $scope.PayThroughList = ['UPI', 'Credit Card', 'Debit Card', 'NetBanking'];
    $scope.MessageList = ['Proprietorship', 'Partnership', ' Private Limited', ' LLP', 'Limited'];
    $scope.WeekStartDayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $scope.bookingTypeList = ['Appointment', 'Table'];
    $scope.CityList = [];
    $scope.BankDataList = [];
    $scope.defaultshow = true;
    $scope.changeshow = false;
    $scope.RegistrationFeesList = [];
    $scope.color = {
        'background-color': 'grey'
    };
    var res;
    $scope.tabs = [
        { id: 1, name: 'Vendor Detail', key:"vendorInfo", active: false },
        { id: 1, name: 'Contact Us', key:"contactus", active: false },
        { id: 2, name: 'Bank Detail', key:"bank", active: false },
        { id: 3, name: 'KYC', key:'kyc',  active: false },
        { id: 4, name: 'Admin Login', key:"adminlogin", active: false },
        { id: 5, name: 'Notes', key:"notes", active: false }  
    ];
    $scope.selectedTab = $scope.tabs[0];
    // $scope.model = {
    //     "adminEmail":"test@yopmail.com","adminPassword":"1234567890","businessCategoryId":"5f1392cb0eb8e02d6499bcf9",
    //     "companyName":"tesse","phone":"0000000000","addressLine1":"test","addressLine2":"test",
        
    //     "cityMasterId":"5f462dc9c23a9523182c0f86","zipcode":"000000","companyType":"Prop","personName":"test",
    //     "bankName":"test","bankBranchName":"test","bankAddress":"test","bankState":"test",
    //     "bankCity":"test","bankAccountNo":"00000000000000","bankIfscCode":"test0000",
    //     "supportEmail":"test@yopmail.com","adminMobile":"1234567890","weekStartDay":"Sunday",
    //     "notes":"test"
    // };
    $scope.model = {};
    var LoginUser = sessionStorage.getItem("SessionId");
    var LoginRole = sessionStorage.getItem("Role");
    var LoginName = sessionStorage.getItem("Username");

    if (LoginUser != null && LoginUser != undefined) {
        if (LoginRole == "company") {
            $scope.CompanyId = LoginUser;
            $scope.LoginName = LoginName;
        } else
            $scope.IsVisible = true;
        $scope.LoginName = LoginName;
    } else {
        window.location.href = "login.html";
    }

    $scope.changeTab = function(tab) {
        $scope.selectedTab = tab;
    };

    // $('#companyLogo').change( function(event) {
    //     res = $("img").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));
    //     console.log(res);
    // });

    

    $('#companyLogo').change(function(){
        // readURL(this.files[0]);
        // res = input.files[0];
        // $(this).attr("event","change");
        res = this.files[0];
        console.log(this.files[0]);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#prev_img').attr('src', e.target.result);
            }
            res = input.files[0];
            // console.log(res);
            reader.readAsDataURL(input.files[0]);
        }
    }

    // $scope.imgchange = function(f) {
    //     var filePath = $('#companyLogo').val();
    //     var reader = new FileReader();
    //     reader.onload = function (e) {
    //         $('#imgs').attr('src',e.target.result);
    //     };
    //     var c = reader.readAsDataURL(f.files[0]);    
    //     console.log(c);      
    // };

    // $scope.onChaacom = function(x){
    //     console.log("1");
    //     console.log(x);
    //     selectedfile = x.target.files[0];
    //     console.log(selectedfile);
    // };

    $scope.submitCompany = function() {
        var preForm = new FormData();
        // console.log($("#companyName").val());
        // console.log($("#addressLine1").val());
        // console.log($("#mapLocation").val());
        // console.log($("#companyLogo").val());
        // console.log($("#personPhotoAttachment").val());
        // console.log($("#aadharCardAttachment").val());
        // console.log($("#panCardAttachment").val());
        // console.log($("#phone").val());

        // preForm.append("personPhoto", $scope.PersonImage);
        // preForm.append("aadharCard", $scope.AadharCard);
        // preForm.append("panCard", $scope.PanCard);
        // preForm.append("cancelledCheque", $scope.CancelledCheque);
        // preForm.append("companyLogo", $scope.CompanyLogo);
        if ($scope.PersonImage != null && $scope.PersonImage.length > 0)
            preForm.append('personPhoto', $scope.PersonImage[0]);

        if ($scope.AadharCard != null && $scope.AadharCard.length > 0)
            preForm.append('aadharCard', $scope.AadharCard[0]);

        if ($scope.PanCard != null && $scope.PanCard.length > 0)
            preForm.append('panCard', $scope.PanCard[0]);

        if ($scope.CancelledCheque != null && $scope.CancelledCheque.length > 0)
            preForm.append('cancelledCheque', $scope.CancelledCheque[0]);

        if ($scope.CompanyLogo != null && $scope.CompanyLogo.length > 0)
            preForm.append('companyLogo', $scope.CompanyLogo[0]);

        var data = {
            "id": 0,
        "doj": $("#doj").val(),
        "businessCategoryId": $("#businessCategoryId").val(),
        "companyName": $("#companyName").val(),
        "addressLine1": $("#addressLine1").val(),
        "addressLine2": $("#addressLine2").val(),
        "cityMasterId": $("#cityMasterId").val(),
        "zipcode": $("#zipcode").val(),
        "mapLocation": $("#mapLocation").val(),
        "phone": $("#phone").val(),
        "fax": $("#fax").val(),
        "bookingType" : $("#bookingType").val(),
        "url": $("#url").val(),
        "supportEmail": $("#supportEmail").val(),
        "adminEmail": $("#adminEmail").val(),
        "adminMobile": $("#adminMobile").val(),
        "adminPassword": $("#adminPassword").val(),
        "gstinNo": $("#gstinNo").val(),
        "paNo": $("#paNo").val(),
        "bankName": $("#bankName").val(),
        "bankBranchName": $("#bankBranchName").val(),
        "bankAddress": $("#bankAddress").val(),
        "bankCity": $("#bankCity").val(),
        "bankState": $("#bankState").val(),
        "bankAccountNo": $("#bankAccountNo").val(),
        "bankIfscCode": $("#bankIfscCode").val(),
        "companyType": $("#companyType").val(),
        "personName": $("#personName").val(),
        "weekStartDay": $("#weekStartDay").val(),
        "cancellationPolicy": $("#cancellationPolicy").val(),
        // "companyLogoAttachment": $("#companyLogo").val(),
        "personPhotoAttachment": $("#personPhotoAttachment").val(),
        "aadharCardAttachment": $("#aadharCardAttachment").val(),
        "panCardAttachment": $("#panCardAttachment").val(),
        "cancelledChequeAttachment": $("#cancelledChequeAttachment").val(),
        "registrationValidUpto": $("#registrationValidUpto").val(),
        };

        // console.log(data);
        // var data1 = new FormData(addvendor);
        // data1.set("companyLogo" , '');
        // data1.set("personPhotoAttachment" , '');
        // data1.set("aadharCardAttachment" , '');
        // data1.set("panCardAttachment" , '');
        // data1.set("cancelledChequeAttachment" , '');
        // // console.log("IMage Path = "+input1.files[0]);
        // for (var pair of data1.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]);
        // };

        $http({
            url: imageroute + "/admin/addCompanyMaster",
            method: "POST",
            data: data,
            // transformRequest: angular.identity,
            // headers: { "Content-Type": undefined, "Process-Data": false },
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                console.log(response);
                if (response.data.Data == 1) {
                    alert("Company Saved!");
                    $("#modal-lg-company").modal("toggle");
                    $scope.model = {};
                    // $scope.Clear();

                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save Company");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );

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

    $scope.submit = function() {
        let files = []
        if ($scope.PersonImage != null && $scope.PersonImage.length > 0)
            files.push({key: 'personPhoto', value: $scope.PersonImage[0]});
        
        if ($scope.AadharCard != null && $scope.AadharCard.length > 0)
            files.push({key:'aadharCard', value: $scope.AadharCard[0]});

        if ($scope.PanCard != null && $scope.PanCard.length > 0)
            files.push({key:'panCard', value: $scope.PanCard[0]});

        if ($scope.CancelledCheque != null && $scope.CancelledCheque.length > 0)
            files.push({key:'cancelledCheque',value: $scope.CancelledCheque[0]});

        if ($scope.CompanyLogo != null && $scope.CompanyLogo.length > 0)
            files.push({key:'companyLogo', value: $scope.CompanyLogo[0]});
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
    $scope.saveCompanyWithFile = function() {
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
                    $scope.GetCompany()
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
    $scope.GetBusinessCategoryType();

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
    $scope.GetCity();


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
    $scope.GetMembershipType();

    $scope.GetCompany = function() {
        $http({
            url: imageroute + "/admin/getCompanyMaster",
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
    $scope.GetCompany();

    $scope.verifyDelete = function(id) {
        $http({
            url: imageroute + "/admin/deleteCompanyMaster",
            method: "POST",
            cache: false,
            data: { id: id, allowDelete: false },
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.IsSuccess ) {
                    $scope.DeleteData(id)
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
                url: imageroute + "/admin/deleteCompanyMaster",
                method: "POST",
                cache: false,
                data: { id: id,allowDelete: true },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.IsSuccess) {
                        alert("Delete Successfully !");
                        $scope.GetCompany();

                    } else {
                        alert("Data Not deleted !");
                        $scope.GetCompany();
                    }
                },
                function(error) {
                    console.log("Internal Server");
                }
            );
        }
    }

    $scope.getCurrentCompany = function(data, index ) {
        $scope.selectedTab = $scope.tabs[0];
        $scope.Id = data._id;
        let companyObj = Object.assign({}, data);
        companyObj.businessCategoryId = data.businessCategoryId && data.businessCategoryId._id ? data.businessCategoryId._id : null;
        companyObj.bankAccountNo = data.bank.bankAccountNo || null ;
        companyObj.bankAddress = data.bank.bankAddress || null ;
        companyObj.bankBranchName = data.bank.bankBranchName || null ;
        companyObj.bankCity = data.bank.bankCity || null ;
        companyObj.bankIfscCode = data.bank.bankIfscCode || null ;
        companyObj.bankName = data.bank.bankName || null ;
        companyObj.bankState = data.bank.bankState || null ;
        companyObj.cityMasterId = data.cityMasterId && data.cityMasterId._id ? data.cityMasterId._id : null;
        companyObj.doj = new Date(data.doj);
        companyObj.registrationValidUpto = new Date(data.registrationValidUpto);

        $scope.model = companyObj;
        setTimeout(() => {

            $("#modal-lg-company").modal("toggle");
            $scope.$apply()
        },500)
    }
    $scope.closeModal = function(e) {
        // $("#modal-lg-company").modal("toggle");
        $scope.model = {};
    }
    $scope.GetBankData = function(data) {
        console.log(data.bank);
        $scope.BankDataList = data.bank;

    }

    $scope.GetLoginData = function(data) {
        $scope.LoginDataList = [];
        $scope.LoginDataList.push(data);

    }


    $scope.Clear = function() {
        $scope.Id = 0;
        $scope.DOJ = "";
        $scope.BusinessCategoryId = "";
        $scope.CompanyName = "";
        $scope.Address1 = "";
        $scope.Address2 = "";
        $scope.CityId = "";
        $scope.Zipcode = "";
        $scope.MapLocation = "";
        $scope.Phone = "";
        $scope.Fax = "";
        $scope.Url = "";
        $scope.SupportEmail = "";
        $scope.AdminEmail = "";
        $scope.AdminMobile = "";
        $scope.AdminPassword = "";
        $scope.GstinNo = "";
        $scope.PancardNo = "";
        $scope.BankName = "";
        $scope.BankBranchName = "";
        $scope.BankAddress = "";
        $scope.BankCity = "";
        $scope.BankState = "";
        $scope.BankAccountNo = "";
        $scope.BankIFSCCode = "";
        $scope.CompanyType = "";
        $scope.PersonName = "";
        $scope.WeekStartDay = "";
        $scope.CancellationPolicy = "";
        $scope.RegistrationValidUpto = "";

        $('[data-toggle="tooltip"]').tooltip()
    }
    $scope.Clear();

    $scope.showRegistration = function() {
        $scope.color = {
            'background-color': 'grey'
        };
        $scope.colors = {
            'background-color': '#17a2b8'
        };
        $scope.defaultshow = true;
        $scope.changeshow = false;
    }

    $scope.showViewRegistration = function(data) {
        $scope.colors = {
            'background-color': 'grey'
        };
        $scope.color = {
            'background-color': '#17a2b8'
        };
        $scope.defaultshow = false;
        $scope.changeshow = true;
    }

    $scope.RegisterData = function(data) {
        $scope.CompanyId = data;
        var list = {
            "companyId": $scope.CompanyId
        }
        $http({
            url: imageroute + "/admin/getregistrationFees",
            method: "POST",
            cache: false,
            data: list,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.RegistrationFeesList = response.data.Data;

                } else {
                    $scope.RegistrationFeesList = [];
                }
            },
            function(error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.RegisterData();

    $scope.submitRegistrationFees = function() {

        console.log($scope.CompanyId);
        var json = {
            "id": $scope.Id,
            "companyId": $scope.CompanyId,
            "regNo": $scope.RegNo,
            "regDate": $scope.RegDate,
            "membershipTypeID": $scope.MemberShipType,
            "amtPaid": $scope.AmtPaid,
            "taxableValue": $scope.TaxableValue,
            "cGSTAmt": $scope.CGSTPercent,
            "sGSTAmt": $scope.SGSTPercent,
            "iGSTAmt": $scope.IGSTPercent,
            "payThrough": $scope.PayThrough,
            "payDateTime": $scope.PayDateTime,
            "transactionNo": $scope.TransactionNo,
            "billNo": $scope.BillNo,
            "billEmailed": true,
            "EmailDateTime": $scope.EmailDateTime

        };
        $http({
            url: imageroute + "/admin/addRegistrationFees",
            method: "POST",
            data: json,
            cache: false,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(function(response) {
                if (response.data.Data == 1) {
                    alert("Registration Fees Saved!");
                    $("#modalRegistrationFees-lg").modal("toggle");
                    $scope.ClearRegistration();
                    $scope.RegisterData();

                } else {
                    $scope.btnsave = false;
                    alert("Unable to Save Registration Fees ");
                }
            },
            function(error) {
                console.log(error);
                $scope.btnsave = false;
            }
        );

    }


    $scope.ClearRegistration = function() {
        $scope.Id = 0;
        $scope.RegNo = "";
        $scope.RegDate = "";
        $scope.MemberShipType = "";
        $scope.AmtPaid = "";
        $scope.TaxableValue = "";
        $scope.CGSTPercent = "";
        $scope.SGSTPercent = "";
        $scope.IGSTPercent = "";
        $scope.PayThrough = "";
        $scope.PayDateTime = "";
        $scope.TransactionNo = "";
        $scope.BillNo = "";
        $scope.EmailDateTime = "";
    }
    $scope.ClearRegistration();

    $scope.DeleteRegistrationFeesData = function(id) {
        var result = confirm("Are you sure you want to delete this ?");
        if (result) {
            $http({
                url: imageroute + "/admin/deleteRegistrationFees",
                method: "POST",
                cache: false,
                data: { id: id },
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(
                function(response) {
                    if (response.data.Data == 1) {
                        alert("Delete Successfully !");
                        $scope.RegisterData();

                    } else {
                        alert("Data Not deleted !");
                        $scope.RegisterData();
                    }
                },
                function(error) {
                    console.log("Internal Server");
                }
            );
        }
    }

});