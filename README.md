# 此页面为通用步骤
[小米Ax3600相关](https://github.com/hm496/miwifi_tools/tree/main/ax3600/README.md)  
[红米Ax5400电竞版相关](https://github.com/hm496/miwifi_tools/tree/main/ax5400_gaming/README.md)

[SSH默认密码计算](https://miwifi.dev/ss)

## 新版SSH步骤(理论上AX3000/AX3600/AX6000/AX9000/万兆路由器/AC2100/AC2350/AX1800/AX5400电竞版/红米AX3000等)：
#### 1. 路由器管理页面-控制台执行: [SSH默认密码计算](https://github.com/hm496/miwifi_tools/blob/main/ssh.js)
#### 2. 完成后获取SSH[默认密码](https://miwifi.dev/ssh)    
#### 3. 登录SSH后执行命令，请根据实际修改：
```
date -s "2024-03-11 21:54:30"
```
> ⚠️"2024-03-11 21:54:30"为当前时间，根据实际修改
#### 4. 到此SSH开启成功，重启会失效，需固化SSH

## 静态路由防火墙配置：
开机会失效，需同时添加到在/etc/rc.local文件exit 0前追加   
> 例如：所有发送到192.168.2.0/24网络的数据包通过网关192.168.31.254进行转发
```
route add -net 192.168.2.0/24 gw 192.168.31.254
```
然后在/etc/config/firewall找到下面内容修改
```
config defaults
	option syn_flood '0'
	option input 'ACCEPT'
	option output 'ACCEPT'
	option forward 'REJECT'
	option drop_invalid '1'改为'0'
	option disable_ipv6 '1'

config zone
	option name 'lan'
	option network 'lan'
	option input 'ACCEPT'
	option output 'ACCEPT'
	option forward 'REJECT'改为'ACCEPT'
```
## 通过防火墙添加自启动脚本
> 用于/etc/rc.local文件重启失效的解决办法
```
curl -o /data "https://fastly.jsdelivr.net/gh/hm496/miwifi_tools@main/startup_script.sh"
chmod +x /data/startup_script.sh
/data/startup_script.sh install
```
编辑/data/startup_script.sh文件查找下方修改为需要执行的开机启动命令
```
startup_script() {
        # Put your custom script here.
        echo "Starting custom scripts..."
}
```
> 注意：该防火墙脚本的执行顺序可能优于/etc/init.d/下的的脚本，因此针对某些特殊情况需延迟执行，例如：(sleep 20; xxx) &
## 声明

本项目中的所有步骤、文件以及相关信息均搜集自互联网，旨在提供学习和参考之用。我们尊重并遵循知识共享的原则，未经过原创作者许可的情况下，不会用于商业用途。如果您是原始内容的作者，且不希望您的作品出现在此项目中，请联系我们，我们将立即删除相关内容。我们感谢互联网上无数开放共享的资源，为我们提供了学习的机会。
