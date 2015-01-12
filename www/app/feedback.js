/**
 * Created by jxteam on 1/5/15.
 */

FeedbackController = function ($scope, $rootScope, $routeParams, $http) {
    $scope.datamode = {};

    $scope.submit = function(){
        if($scope.datamode.email == ""){
            alert("请填写邮箱");
            return
        }
        if($scope.datamode.name == ""){
            alert("请填写姓名");
            return
        }
        if($scope.datamode.cont == ""){
            alert("请填写需要提交的内容");
            return
        }
        $http.post($rootScope.host+ "/Feedback/Insert",$scope.datamode).success(function (data) {
            if (data.Status == 1) {
                alert("提交成功，请耐心等待我们回复");
                document.getElementById("form").reset();
            } else {
                alert("提交内容失败，请刷新重试");
            }
        }).error(function () {
            alert("网络错误")
        });
    }
}