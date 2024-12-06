#!/bin/sh

host_key=/etc/dropbear/dropbear_rsa_host_key
host_key_bk=/data/auto_ssh/dropbear_rsa_host_key

if [ -f $host_key_bk ]; then
    ln -sf $host_key_bk $host_key
fi

# Enable telnet, ssh, uart and boot_wait.
[ "$(nvram get telnet_en)" = 0 ] && nvram set telnet_en=1 && nvram commit
[ "$(nvram get ssh_en)" = 0 ] && nvram set ssh_en=1 && nvram commit
[ "$(nvram get uart_en)" = 0 ] && nvram set uart_en=1 && nvram commit
[ "$(nvram get boot_wait)" = "off" ]  && nvram set boot_wait=on && nvram commit

channel=`/sbin/uci get /usr/share/xiaoqiang/xiaoqiang_version.version.CHANNEL`
if [ "$channel" = "release" ]; then
    sed -i 's/channel=.*/channel="debug"/g' /etc/init.d/dropbear
    /etc/init.d/dropbear restart 2>/dev/null
    /etc/init.d/dropbear enable
fi

if [ ! -s $host_key_bk ]; then
    i=0
    while [ $i -le 30 ]
    do
        if [ -s $host_key ]; then
            cp -f $host_key $host_key_bk 2>/dev/null
            break
        fi
        let i++
        sleep 1s
    done
fi
