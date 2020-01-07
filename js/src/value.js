var a_idx = 0;

$("body").click(function(e) {
  var a = ["秒速五厘米", "言叶之庭", "你的名字", "天气之子",
      "星之声", "千与千寻", "罗小黑战记", "追逐繁星的孩子",
      "未闻花名", "龙猫", "她和她的猫", "某人的目光","魁拔","镇魂街",
      "我是江小白","超神学院","刺客五六七"];
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
      1900,
      function() {
        $i.remove()
      })
});