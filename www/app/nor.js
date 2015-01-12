/**
 * Created by jxteam on 1/4/15.
 */
NorListController = function ($scope, $rootScope, $routeParams, $http) {
    $scope.docmode = {}
    $http.get($rootScope.host + "/Index/Tree?tid=" + $routeParams.Id).success(function (data) {
        $scope.tree = data
        if (data.Selecty == "" || data.Selecty == undefined) {
            $scope.selecty = {
                Name: "",
                SName: "",
                Data: []
            }
        } else {
            $scope.selecty = eval("(" + data.Selecty + ")");
            $scope.docmode.T1 = "all"
            $scope.docmode.T2 = "all"
        }
        $scope.init();
    }).error(function () {
        console.log(11)
    });

    $scope.T1Select = function () {
        $scope.docmode.T2 = "all"
        for (var i = 0; i < $scope.selecty.Data.length; i++) {
            if ($scope.docmode.T1 == $scope.selecty.Data[i].id) {
                $scope.currT1 = i;
                break;
            }
        }
        $scope.init();
    }

    $scope.T2Select = function () {
        $scope.init();
    }

    $scope.curr_p = 1;
    $scope.init = function (p) {
        var url = $rootScope.host + '/Nor/ListA?tid=' + $routeParams.Id;
        if (p == undefined) p = $scope.curr_p;
        url = url + "&p=" + p;

        url = url + "&T1=" + $scope.docmode.T1 + "&T2=" + $scope.docmode.T2;
        $http.get(url).success(function (data) {
            $scope.list = data.list;
            $scope.total = data.Total;
            $scope.l = data.l;
            $scope.curr_p = p;
        }).error(function () {
            Messenger().post({
                message: "服务器出错，请稍后再试0.0",
                type: "error"
            });
        });
    }
    $scope.page = [];
    var pageinit = function () {
        $scope.page = [];
        var p = $scope.curr_p;
        var total = $scope.total;
        var l = $scope.l;
        var addnum = 0;
        if (total % l != 0) addnum = 1;
        var allpage = (total - (total % l)) / l + addnum;
        console.log(allpage)
        if (allpage == 1 || allpage == 0) {
            return
        } else if (1 < p && p < allpage) {
            $scope.page.push({
                Name: "上一页",
                p: p - 1
            });
            $scope.page.push({
                Name: "下一页",
                p: p + 1
            });
        } else if (p == allpage) {
            $scope.page.push({
                Name: "上一页",
                p: p - 1
            })
        } else if (p == 1) {
            $scope.page.push({
                Name: "下一页",
                p: p + 1
            });
        }
    }
}

NorContController = function ($scope, $rootScope, $routeParams, $http) {
    $http.get($rootScope.host + "/Nor/CoutA?id=" + $routeParams.id).success(function (data) {
        document.getElementById("media_wrap").innerHTML = data.Cout;
        var is=document.getElementsByTagName("iframe");
        is[0].style.width = document.body.clientWidth+"px";
        is[0].style.height = (document.body.clientHeight-40)+"px";
        $scope.Name = data.Name;
    }).error(function () {
        console.log(11)
    });
}