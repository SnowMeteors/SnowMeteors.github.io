---
title: Windows提权
date: 2020-03-19 12:57:32
tags:
- windows提权
categories:
- 渗透测试
---
### 前言
　　本章主要是讲关于win10下的提权合集，温馨提示cmd请以管理员身份运行，不然会出现权限不够等问题。第一次写渗透测试实验报告，如有错误，请多包涵。
<!-- more -->

### 工具准备
　　[Sysinternals](https://download.sysinternals.com/files/SysinternalsSuite.zip)
　　[Pinjector](https://www.tarasco.org/security/Process_Injector/index.html)
### whoami命令
　　利用whoami查看当前计算机登陆的用户和组
　　![](whoami.png)
　　可以看出当前是在desktop-3vs7u23\lion组中
### psexec提权
　　将Sysinternals中的psexec.exe拷贝到C:\Windows\System32下后
　　输入PsExec.exe -i -s cmd命令
　　-i 命令是运行程序，使其与远程系统上指定会话的桌面进行交互
　　-s 在系统帐户中运行该服务进程
　　![](psexec.png)
　　这时会弹出一个新的cmd框，在新的cmd框中再次输入whoami命令
　　![](psexec_successful.png)
　　发现用户组已经变成了nt authority\system
　　此时试试打开一个notepad，查看登陆用户
　　![](psexec_system.png)
　　可以看见登陆用户是system，即在此cmd框中创建的用户都是system
### pinjector注入进程提权
　　将 pinjector.exe拷贝到C:\Windows\System32下
　　执行pinjector -l查看可注入的进程
　　![](pinjector.png)
　　看红线可知有很多用户和组，我们只需要注入带system组的进程
　　执行pinjector -l | find "SYSTEM" 查找只包含SYSTEM的进程
　　![](pinjector_find.png)
　　执行pinjector -p 648 cmd 333
　　-p 表示当前的pid然后执行一个cmd命令框并且再本地开启333端口，端口在后面nc会使用
　　![](projector_help.png)
　　并不是所有的进程都能注入成功，以下就是失败的情况
　　![](projector_fail.png)
　　这时只能一个一个试，直到找到一个能成功注入的进程
　　![](pinjector_successful.png)
　　执行netstat -an查看端口开启是否成功
　　![](netstat.png)
　　利用nc命令来连接，并查看提权是否成功
　　![](nc.png)
　　可以看到提权已经成功了，这时在打开靶机的任务管理器，发现有一个cmd.exe，除此之外并没有多余的进程产生，利用注入进程的方式隐蔽性极高，很难发现
　　![](taskmgr.png)
　　打开Sysinternals中的procexp.exe，此工具是进程管理工具，查看当前有哪些可疑的进程
　　![](process_check.png)
　　因为我是向sladmin进程注入的，为了演示可以很清楚的看见有一个cmd.exe在运行中，如果注入进一个系统服务后，查找难度可想而知
　　