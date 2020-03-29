---
title: burpsuite
date: 2020-03-29 12:30:02
tags:
- burpsuite
categories:
- 渗透测试
---

### 前言
　　Burp Suite 是一款非常优秀的抓包工具之一，渗透测试必备神器，本章不介绍最最最基本的抓包配置等等，只介绍常用功能。
<!-- more -->
### 环境
　　物理机: 192.168.2.213
　　靶　机: 192.168.2.123
　　K a l i  : 192.168.2.161
### Proxy
####  问题描述
　　物理机无法抓靶机流量包，Kali能抓靶机流量包，但告知你必须要用物理机去抓到靶机流量包，怎样办？
#### 问题解决
　　在Proxy->Options->Proxy Listeners->Add 添加代理侦听
　　![](burpsuite/AddProxyListener.png)
　　设置绑定端口：随便设置 我设置为8080，设置绑定地址：我设置的是全网卡，直接ok选择yes后退出
　　![](burpsuite/ShowProxyResult.png)
　　不抓本地包，所以去掉第一个选项卡
　　配置靶机中浏览器代理为物理机中的ip，端口为刚才设置的8080
　　![](burpsuite/ProxySetting.png)
　　抓包成功,当然强大的burp也能抓手机包,本篇不介绍
　　![](burpsuite/ProxySettingSuccess.png)
#### Options
　　只介绍Response Modification功能
　　设置用于执行自动响应的修改。可以使用这些选项通过自动重写应用程序响应的HTML来完成各种任务。 下列选项在数据删除客户端控件可能是有用的
　　![](burpsuite/ResponseModification.png)
　　有些网页中是把表单隐藏了的
　　Unhide hidden form fields:显示隐藏的表单
　　　　Prominently highlight unhidden fields:高亮显示这些字段
　　有些表单是禁止输入内容的
　　Enable disabled form fields:启用禁用的表单
　　比如你输入密码框长度不能超过多少位，这个就可以突破
　　Remove input field length limits:移除输入字段长度限制
　　比如是否按正确的格式去输入
　　Remove JavaScript from validation:从验证中删除JavaScript
　　这个具体实际作用在哪里我也不知道
　　Remove secure flag from cookies:从cookies中删除安全标志
　　secure flag如图所示
　　![](burpsuite/CheckCookie.png)

### Target
####  site map
　　当你抓取到了流量包后,会在target模块中生成站点地图,它采用树状的层次结构显示信息。
　　站点又分为两类:黑色和灰色
　　黑色:浏览器真正的对一个url发起了请求,服务器对它返回了响应信息
　　灰色:从页面中的url爬网爬出来的,并没有对该url的资源发生真正的访问一次。
![](burpsuite/TargetSiteMap.png)

| 内容区域 | 信息描述 |
| :------: | :------: |
|   左边   | 站点层次目录 |
| 中上 | 此站点具体请求流量包历史 |
| 中下 | 此流量包具体数据内容(请求包,响应包) |
| 右上 | 安全提示 |
| 右下 | 安全建议 |

#### scope
　　查看当前站点过滤信息，当你想只查看某一个站点信息或者某个目录的时候，如下图所示选择要显示的站点，发送到scope去。
　　![](burpsuite/AddToScope.png)
　　Include in scope:只查看当前列表中的站点信息=白名单
　　Exclude from scope:排除掉列表中的站点信息=黑名单
　　![](burpsuite/Scope.png)

#### site map filter
　　单击filter哪一栏,会弹出过滤器规则,当你勾选好过滤规则后,只需要点击其他空白处,就会自动开始过滤
　　![](burpsuite/SiteMapFilter.png)
　　Show only in-scope items:仅显示范围内的站点(此处需搭配scope使用) 勾选后入图所示
　　![](burpsuite/ScopeFilterSuccess.png)
　　Show only requested items:仅显示真正发起请求的站点
　　Show only parameterizend requests:仅显示参数化的请求 也就是 过滤掉html,htm这类站点
　　Filter by search term:按关键词筛选 比如我只看url地址中包含了dvwa关键字
　　![](burpsuite/FilterDvwa.png)
　　结果入图所示
　　![](burpsuite/FilterDvwaSuccess.png)
　　Filter by MIME type:按文件类型筛选
　　Filter by status code:按状态码筛选
　　Filter by file extension:按文件扩展名筛选 
　　　　show only:展示asp,aspx,jsp,php等扩展名
　　　　Hide:不展示js,gif,jpg,png,css等扩展名
　　Filter by annotation:
　　　　Show only commented items:仅显示注释的项目
　　　　给url添加注释
　　　　![](burpsuite/AddComment.png)
　　　　添加完注释后
　　　　![](burpsuite/CommentOver.png)
　　　　Show only highlighted items:仅显示高亮的项目
　　　　点击host进行高亮设置
　　　　![](burpsuite/HighlightSetting.png)
　　当你选乱的情况下,在Filter下面show all;hide all那一栏点击Revert changes:还原更改

### Spider
