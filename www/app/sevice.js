/*导航栏服务*/

app.service('TreeService', function ($rootScope, $http, $location) {
    $rootScope.TreeTabs = [
        {
            _id: "BASE_COUT", Name: "微官网", Ty: "Sub",
            Icon: "icon-shouye1",
            Sub: [
                {Name: "栏目管理", Ty: "CUrl", Url: "/Column"},
                {Name: "栏目内容", Ty: "CUrl", Url: "/ContL/all"},
                {Name: "顶部广告", Ty: "CUrl", Url: "/Setting/Flash"},
                {Name: "模板选择", Ty: "CUrl", Url: "/Setting/Tmp"},
                {Name: "辅助按钮", Ty: "CUrl", Url: "/Setting/Btn"},
                {Name: "图文素材", Ty: "CUrl", Url: "/Material"},
                {Name: "分享设置", Ty: "CUrl", Url: "/Setting/Share"}
            ]
        },
        {
            _id: "BASE_BACK", Name: "自动回复", Ty: "Sub",
            Icon: "icon-pinglun",
            Sub: [
                {Name: "关注时欢迎信息", Ty: "CUrl", Url: "/FeedBack/Attent"},
                {Name: "关键词回复", Ty: "CUrl", Url: "/FeedBack/Key"},
                {Name: "机器人", Ty: "CUrl", Url: "/FeedBack/Robot"}
            ]
        },
        /*
         {
         _id: "BASE_ACTIVITY", Name: "现场活动", Ty: "Sub",
         Icon:"icon-huwai",
         Sub: [
         {Name: "微上墙", Ty: "CUrl", Url: "/Book"},
         {Name: "幸运大抽奖", Ty: "CUrl", Url: "/Promote"},
         {Name: "摇一摇", Ty: "CUrl", Url: "/Bonus"},
         {Name: "对对碰", Ty: "CUrl", Url: "/Combo"},
         {Name: "投票", Ty: "CUrl", Url: "/Combo"},
         ]
         },
         {
         _id: "BASE_XITIE", Name: "微喜帖", Ty: "Sub",
         Icon:"icon-wodeyouhuijuan",
         Sub: [
         {Name: "首页幻灯片", Ty: "CUrl", Url: "/IndexFlash"},
         {Name: "首页团购", Ty: "CUrl", Url: "/PcIndex/tuan"},
         {Name: "首页热卖", Ty: "CUrl", Url: "/PcIndex/hots"},
         {Name: "猜你喜欢", Ty: "CUrl", Url: "/PcIndex/ulike"},
         {Name: "新品上架", Ty: "CUrl", Url: "/PcIndex/new"},
         {Name: "楼层设置", Ty: "CUrl", Url: "/PcFloors"},
         {Name: "首页公告", Ty: "CUrl", Url: "/PcInfo"},
         ]
         },
         {
         _id: "BASE_XIANG", Name: "微相册", Ty: "Sub",
         Icon:"icon-datumoshi1",
         Sub: [
         {Name: "首页幻灯片", Ty: "CUrl", Url: "/IndexActive"},
         {Name: "首页活动", Ty: "CUrl", Url: "/IndexActive"},
         {Name: "首页团购", Ty: "CUrl", Url: "/PcIndex/tuan"},
         {Name: "首页热卖", Ty: "CUrl", Url: "/PcIndex/hots"},
         {Name: "猜你喜欢", Ty: "CUrl", Url: "/PcIndex/ulike"},
         {Name: "新品上架", Ty: "CUrl", Url: "/PcIndex/new"},
         {Name: "楼层设置", Ty: "CUrl", Url: "/PcFloors"},
         {Name: "首页公告", Ty: "CUrl", Url: "/PcInfo"},
         ]
         },
         */
        {
            _id: "BASE_NOTICE", Name: "统计＆公告", Ty: "Sub",
            Icon: "icon-shengbo",
            Sub: [
                {Name: "数据统计", Ty: "CUrl", Url: "/"},
                {Name: "网站公告", Ty: "CUrl", Url: "/PcIndex/rush"}
            ]
        },
        {
            _id: "BASE_SET", Name: "网站设置", Ty: "Sub",
            Icon: "icon-gongnengjianyi",
            Sub: [
                {Name: "网站信息", Ty: "CUrl", Url: "/Setting/Info"},
                {Name: "微信信息", Ty: "CUrl", Url: "/Setting/Wc"},
                {Name: "自定义菜单", Ty: "CUrl", Url: "/Setting/Menu"},
            ]
        }
    ]
});

/*运行部分代码*/
app.run(function (TreeService, $rootScope) {
    $rootScope.WebId = window.WebId;
    $rootScope.host = "http://115.29.113.249:2017"
    //$rootScope.host = "http://10.64.3.140:2017"
    $rootScope.$on('$locationChangeSuccess',function(event) {
        var node = document.getElementById("baguetteBox-overlay");
        if (node!=null){
            //node.style.display = "none"
            node.parentNode.removeChild(node);
            window.baguetteBox = null;
        }
    });
});