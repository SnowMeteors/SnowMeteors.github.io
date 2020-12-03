---
title: MongoDB未授权访问漏洞
categories:
  - 漏洞复现
abbrlink: 41987
date: 2020-12-03 09:46:45
---

### 前言
　　本次搭建环境均在docker进行
　<!-- more -->

### 环境搭建
```bash
docker search mongodb  # 从Docker Hub查找镜像
```
<img src="https://s3.ax1x.com/2020/12/03/DoLhrj.png">
```
docker pull mongo  #从镜像仓库中拉取或者更新指定镜像
```
<img src="https://s3.ax1x.com/2020/12/03/DoX540.png">
```bash
docker images mongo #列出本地主机上的mongo镜像
```
<img src="https://s3.ax1x.com/2020/12/03/DojVUI.png">
```
docker run -d -p 27017:27017 --name mongodb mongo  # 创建一个新的容器并运行一个命令
```
<img src="https://s3.ax1x.com/2020/12/03/Dojn8f.png">

```
docker ps # 显示正在运行的容器
```
<img src="https://s3.ax1x.com/2020/12/03/DojfMD.png">

### 漏洞验证
　　1.使用msf

```
use auxiliary/scanner/mongodb/mongodb_login
set rhosts 192.168.127.132
run
```

<img src="https://s3.ax1x.com/2020/12/03/Dov6mQ.png">

　　2.使用NoSQLBooster
　　点击test connection测试连接
<img src="https://s3.ax1x.com/2020/12/03/Dovz6O.png">
　　出现ok后，测试连接成功点击close，回到主界面，点击Save & Connect
<img src="https://s3.ax1x.com/2020/12/03/Dox6gK.png">

<img src="https://s3.ax1x.com/2020/12/03/DozQKO.png">

### 后记
　　百度搜了，google也搜了，完全没有一篇关于getshell的文章，所以这个漏洞只造成了信息泄露吗？