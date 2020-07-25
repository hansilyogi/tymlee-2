app.controller('BillController', function($scope, $http) {
    $scope.imageroute = imageroute;
    $scope.Id = "0";
    $scope.DataList = [];
    $scope.MessageList = ['Free', 'Standard', 'Enterprise'];
    $scope.MemberType = $scope.MessageList[0];


});