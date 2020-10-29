$("body").click(function(e) {
  var a = [
              "辉夜姬物语","风之谷","虞美人盛开的山坡","侧耳倾听",
              "哈尔的移动城堡","红猪","疯狂动物城","悬崖上的金鱼姬",
              "秒速五厘米", "言叶之庭", "你的名字", "天气之子","寻梦环游记",
              "星之声", "千与千寻", "罗小黑战记", "追逐繁星的孩子",
              "未闻花名", "龙猫", "她和她的猫", "某人的目光","魁拔","镇魂街",
              '我是江小白',"超神学院","刺客五六七","星游记","三体","四月是你的谎言",
              "怪物之子","未来的未来","狼的孩子雨与雪","穿越时空的少女","夏日大作战",
              "云之彼端，约定的地方","借东西的小人阿莉埃蒂","起风了","可塑性记忆","心灵想要大声呐喊",
              "Clanned","想要传达你的声音","魔女宅急便","幽灵公主","未来机械城",
              "摇滚藏獒","AIR","企鹅公路","猫的报恩","天空之城","利兹与青鸟","声之形",
              "朝花夕誓","白蛇缘起","大护法","无敌破坏王","我想吃掉你的胰脏","萤火之森",
              "萤火虫之墓","一拳超人","烟花","数码宝贝","大鱼海棠","肆式青春","超能陆战队",
              "十字路口","昨日青空","精灵王座","驯龙高手","HELLO WORLD","海兽之子","岁月的童话",
              "百变狸猫","鲁邦三世：卡里奥斯特罗城","妙先生","写给桃子的信","若能与你共乘海浪之上"
        ];
  var stringIndex = Math.floor((Math.random()*a.length));
    function getLength(val) {
        var str = new String(val);
        var bytesCount = 0;
        for (var i = 0 ,n = str.length; i < n; i++) {
            var c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                //手动测试一个英文占10像素，中文占15像素
                bytesCount += 10;
            } else {
                bytesCount += 17;
            }
        }
        return bytesCount;
    }
    var $i = $("<span/>").text(a[stringIndex]);
  var x = e.pageX,
      y = e.pageY;
  $i.css({
    "z-index": 144469,
    "top": y - 40,
    "left": x - getLength(a[stringIndex]) / 2,    //设置文字居中
    "position": "absolute",
    "font-weight": "bold",
    "color": "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
  });
  $("body").append($i);
  $i.animate({
        "top": y - 150,
        "opacity": 0
      },
      1800,
      function() {
        $i.remove()
      })
});