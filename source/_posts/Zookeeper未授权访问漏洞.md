---
title: Zookeeper未授权访问漏洞
categories:
  - 漏洞复现
abbrlink: 34357
date: 2020-12-07 11:51:31
---

### 前言
　　在docker下搭建环境
<!-- more -->
### 环境搭建

```bash
docker search zookeeper
docker pull zookeeper
docker run -d -p 2181:2181 --name zookeeper zookeeper
```

### 漏洞验证
　　利用zookeeper可视化管理工具进行连接,下载地址:https://issues.apache.org/jira/secure/attachment/12436620/ZooInspector.zip
　　<img src="https://s3.ax1x.com/2020/12/07/DvgbIx.png">

