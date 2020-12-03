---
title: Kali安装docker
abbrlink: 21600
date: 2020-12-03 09:14:39
tags:
---
### 前言
　　本章介绍如何在kali linux安装docker，无坑版
<!--more-->
### 安装https协议、CA证书、dirmngr

```bash
apt-get update
apt-get install -y apt-transport-https ca-certificates
apt-get install dirmngr
```

### 添加GPG密钥并添加更新源

```bash
curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/debian/gpg | sudo apt-key add -

echo 'deb https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/debian/ buster stable' | sudo tee /etc/apt/sources.list.d/docker.list
```

### 系统更新以及安装docker

```bash
apt-get update
apt install docker-ce
```

### 启动docker

```
service docker start
```

### 安装compose

```bash
apt install docker-compose
```
### 更换docker镜像源

docker 默认镜像源是国外,访问速度非常慢,所以要将镜像源更改为国内的

```bash
vi /etc/docker/daemon.json # 没有则创建，有就修改
```

在daemon.json改为以下内容

```bash
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
```

### docker安装测试

```bash
docker run hello-world 
```
如果出现此提示，说明docker没有启动起来，再次启动docker，再执行docker run hello-world即可
<img src="https://s3.ax1x.com/2020/12/03/Do7jEV.png">

```bash
service docker start #启动docker
service docker status #查看docker状态
```
出现下图，恭喜安装成功
<img src="https://s3.ax1x.com/2020/12/03/Do7vNT.png">

