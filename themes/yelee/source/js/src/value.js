﻿var a_idx = 0;

$("body").click(function(e) {
  var a = ["此点击出","来的字代","表本人看","过的动漫","特此纪念",

          "秒速五厘米", "言叶之庭", "你的名字", "天气之子",
          "星之声", "千与千寻", "罗小黑战记", "追逐繁星的孩子",
          "未闻花名", "龙猫", "她和她的猫", "某人的目光","魁拔","镇魂街",
          '我是江小白',"超神学院","刺客五六七","星游记","三体","四月是你的谎言",
          "怪物之子","未来的未来","狼的孩子雨与雪","穿越时空的少女","夏日大作战",
          "云之彼端，约定的地方","借东西的小人","起风了","可塑性记忆","心灵想要大声呐喊",
          "Clanned","想要传达你的声音","魔女宅急便","幽灵公主","未来机械城",
          "摇滚藏獒","AIR","企鹅公路","猫的报恩","天空之城","利兹与青鸟","声之形",
          "朝花夕誓","白蛇缘起","大护法","无敌破坏王","我想吃掉你的胰脏","萤火之森",
          "萤火虫之墓","一拳超人","烟花","数码宝贝","大鱼海棠","肆式青春","超能陆战队",
          "十字路口","昨日青空","精灵王座","驯龙高手",

      "已经结束","感谢点击","再次点击","将会循环","特此说明"];
  var $i = $("<span/>").text(a[a_idx]);
  a_idx = (a_idx + 1) % a.length;
  var x = e.pageX,
      y = e.pageY;
  $i.css({
    "z-index": 144469,
    "top": y - 40,
    "left": x - 25,
    "position": "absolute",
    "font-weight": "bold",
    "color": "#64d2e6"
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