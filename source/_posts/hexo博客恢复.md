---
title: hexo博客恢复
date: 2020-01-13 10:06:36
categories:
- hexo
---

标题的意思是指如何在其他电脑继续使用hexo写博客，前提是你备份了你的hexo文件，注意当你配置好了hexo环境后，勿用hexo init命令。

<!--more-->

### 拷贝以下文件到博客根目录下

```
_config.yml
 package.json
 scaffolds/
 source/
 themes/
```

### 执行模块安装的命令

```
npm install -g hexo
npm install
npm install hexo-deployer-git --save
npm install hexo-generator-feed --save
npm install hexo-generator-sitemap --save
```

### 开始部署

```
hexo g
hexo deploy
```

提醒一下，当你在其他电脑执行hexo d命令时，远程仓库的commits将会全部清空。