/**
 * Created by jxteam on 14-8-27.
 */
HomeController = function ($scope,$rootScope,$routeParams, $http) {
    document.getElementById("center").style.marginTop=(document.body.clientHeight-250)/2-5+"px"
    $scope.curr_p = 1;
    $http.get($rootScope.host+ "/Index/IndexP").success(function (data) {
        $scope.datas = data
    }).error(function () {
        alert("网络错误,获取列表失败")
    });

    $scope.goUrl = function(url){
        if (typeof navigator !== "undefined" && navigator.app) {
            navigator.app.loadUrl(url, {openExternal: true});
        } else {
            window.open(url, "_system", 'location=yes');
        }
    }

    if(document.body.clientWidth>=1280){
        document.getElementById("center").style.marginTop=(document.body.clientHeight-480)/2-5+"px"
    }
}