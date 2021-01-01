/*网页鼠标点击特效（爱心）*/
!function (e, t, a) {
    function r() {
        for (var e = 0; e < s.length; e++) s[e].alpha <= 0 ? (t.body.removeChild(s[e].el), s.splice(e, 1)) : (s[e].y--, s[e].scale += .004, s[e].alpha -= .013, s[e].el.style.cssText = "left:" + s[e].x + "px;top:" + s[e].y + "px;opacity:" + s[e].alpha + ";transform:scale(" + s[e].scale + "," + s[e].scale + ") rotate(45deg);background:" + s[e].color + ";z-index:99999");
        requestAnimationFrame(r)
    }

    function n() {
        var t = "function" == typeof e.onclick && e.onclick;
        e.onclick = function (e) {
            t && t(), o(e)
        }
    }

    function o(e) {
        var a = t.createElement("div");
        a.className = "heart", s.push({
            el: a,
            x: e.clientX - 5,
            y: e.clientY - 5,
            scale: 1,
            alpha: 1,
            color: c()
        }), t.body.appendChild(a)
    }

    function i(e) {
        var a = t.createElement("style");
        a.type = "text/css";
        try {
            a.appendChild(t.createTextNode(e))
        } catch (t) {
            a.styleSheet.cssText = e
        }
        t.getElementsByTagName("head")[0].appendChild(a)
    }

    function c() {
        return "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
    }

    var s = [];
    e.requestAnimationFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function (e) {
        setTimeout(e, 1e3 / 60)
    }, i(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"), n(), r()
}(window, document);



//添加路径定位，这hexo竟然一点都不智能，都不知道跳转到index.html
var pages = document.getElementsByClassName("page-number");
if(pages)
{
    for(var i = 0;i < pages.length;i++)
    {
        if(pages[i].className == "page-number")
        {
            pages[i].href += "index.html";
        }
    }
}

var avater = document.getElementsByClassName("profilepic");
if(avater)
{
    avater[0].href = "/index.html";
    avater[0].target = "go";
}


var CategoryListLink = document.getElementsByClassName("category-list-link");
//存在
if(CategoryListLink)
{
    for(var i = 0;i < CategoryListLink.length;i++)
    {
        CategoryListLink[i].href += "index.html";
        CategoryListLink[i].target = "go";
    }
}

var friend = document.getElementsByClassName("switch-friends-link");
if(friend && friend.length > 0)
{
    for(var i = 0;i < friend.length;i++)
    {
        friend[i].target = "_blank";
    }
}

var taglistlink = document.getElementsByClassName("article-tag-list-link");
if(taglistlink && taglistlink.length > 0)
{
    for(var i = 0;i < taglistlink.length;i++)
    {
        taglistlink[i].href += "index.html";
    }
}

var Taglink = document.getElementsByClassName("tag-list-link");
if(Taglink && Taglink.length > 0)
{
    for(var i = 0;i < Taglink.length;i++)
    {
        Taglink[i].href += "index.html";
    }
}

var category = document.getElementsByClassName("article-category");
if(category)
{
    for(var i = 0;i < category.length;i++)
    {
        var a = category[i].getElementsByTagName("a");
        if(a)
        {
            a[0].href += "index.html";
        }
    }
}

var tags = document.getElementsByClassName("tags");
if(tags)
{
    // console.log(tags);
    if(tags.length !== 0)
    {
        var tag = tags[0].getElementsByTagName("a");
        for(var i = 0;i < tag.length;i++)
        {
            tag[i].href += "index.html";
            tag[i].target = "go";
        }
    }

}

var b = document.getElementById('page-nav');
//不为空判断
if(b)
{
    b.getElementsByTagName("a");
    for(var i = 0;i < b.length;i++)
    {
        b[i].target = "go";
        b[i].href += "index.html"
    }
}

var soicals = document.getElementsByClassName("social");
if(soicals.length !== 0)
{
    var social = soicals[0].getElementsByTagName("a");
    for(var i = 0;i < social.length;i++)
    {
        social[i].target = "_blank";
    }
}

















