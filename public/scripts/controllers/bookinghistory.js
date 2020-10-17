app.controller('BookingHistoryController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.PendingList = [];
    $scope.CompletedList = [];
    $scope.CancelledList = [];
    $scope.MessageList = ['Restaurant', 'Salon', 'Beauty Parlour', 'Spa', 'Hospitals'];



    $scope.GetBookingHistory = function() {

        $http({
            url: imageroute + "/admin/getBookingHistory",
            method: "POST",
            cache: false,
            data: {},
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data.length >= 1) {
                    $scope.DataList = response.data.Data;
                    for (let i = 0; i < $scope.DataList.length; i++) {
                        $scope.PendingList = $scope.DataList[i].Pending;
                        $scope.CompletedList = $scope.DataList[i].Complete;
                        $scope.CancelledList = $scope.DataList[i].Cancelled;
                    }
                    console.log($scope.CompletedList);
                } else {
                    $scope.DataList = [];
                }
            },
            function(error) {
                console.log("Internal Server");
            }
        );
    }
    $scope.GetBookingHistory();

    $scope.CancelOrder = function(id) {
        console.log(id);
        var json = {
            "bookingId": id,
            "status": "cancelled"
        }
        console.log(json);
        $http({
            url: imageroute + "/admin/updateBookingCancel",
            method: "POST",
            cache: false,
            data: json,
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        }).then(
            function(response) {
                if (response.data.Data == 1) {
                    alert("Order Cancel!");
                    $scope.GetBookingHistory();
                } else {
                    $scope.DataList = [];
                }
            },
            function(error) {
                $scope.btnsave = false;
                alert("Unable to Update");
            }
        );

    }


    $scope.GetPendingOtherDetails = function(data) {
        $scope.GetPendingOtherDetailList = [];
        $scope.GetPendingOtherDetailList.push(data);

    }

    $scope.GetCompletedOtherDetails = function(data) {
        $scope.GetCompletedOtherDetailList = [];
        $scope.GetCompletedOtherDetailList.push(data);

    }

    $scope.GetCancelledOtherDetails = function(data) {
        $scope.GetCancelledOtherDetailList = [];
        $scope.GetCancelledOtherDetailList.push(data);

    }

    $scope.convertToCSVString = function(str) {

        return (str && str.length) ?
          `" ${str} "` : // str.replace(/,/g, ' - ')  : 
          ''
      }
      $scope.generateCSVData = function(records) {
        records = JSON.parse(JSON.stringify(records))
        const headings = [
            "Appointment Date",
            "Appointment Time",
            "Bill Emailed",
            "Booking Date",
            "Booking For Name",
            "Company Name",
            "Company Type",
            "Customer Name",
            "Customer Rating",
            "Inventory Name",
            "OrderNo",
            "Total AMount",
            "Service Charge",
            "Pay Through",
            "PayDate Time",
            "Customer Feeback",
            'Status',
            'Activity Status'
        ];
        let allData = records.map((record) => {
          let obj = {
           
            "Appointment Date" : $scope.convertToCSVString(record.appointmentDate),
            "Appointment Time" : $scope.convertToCSVString(record.appointmentTime),
            "Bill Emailed" : record.billEmailed,
            "Booking Date" : $scope.convertToCSVString(record.bookingDate),
            "Booking For Name" : record.bookingForName,
            "Company Name" : record.companyId.companyName,
            "Company Type" : record.companyId.companyType,
            "Customer Name" : record.customerId.firstName + ' ' + record.customerId.lastName,
            "Customer Rating" : record.customerRating,
            "Inventory Name" : record.inventoryId.inventoryName,
            "OrderNo" : $scope.convertToCSVString(record.orderNo),
            "Total AMount" : record.totalAmt,
            "Service Charge" : record.serviceCharge,
            "Pay Through" : record.payThrough,
            "PayDate Time" : $scope.convertToCSVString(record.payDateTime),
            "Customer Feeback": record.customerFeeback,
            'Status' : record.status,
            'activityStatus': record.activityStatus,
          }
          const values = Object.values(obj)
          return values;
        });
        allData.unshift(headings.join(','));
        let csvContent = allData.join('\r\n');
        return csvContent;
      }

    $scope.download = function() {
        let data = this.generateCSVData($scope.PendingList);
        let a = document.createElement('a');
        let blob = new Blob([data], { type: 'text/csv' });
        // let blob = new Blob([res],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        let  url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = `Report-${new Date()}.csv`; //.xlsx
        a.click();
        setTimeout(() => {
          this.exportBtnLoading = false;
          this.selection.clear();
        }, 500);
    }
});