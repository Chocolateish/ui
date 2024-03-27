import { attachContextMenu } from "@src/page/contextmenu";
import "./index.scss";
import { UI } from "@src/menu";
import { openWindowExternal, openWindowVirtual } from "@src/page";
import { Base } from "@src/base";
import { Content } from "@src/page/content";
import { State } from "@src/state";
import { Ok } from "@src/result";
import { IP, IPType } from "@src/util";
import { material_av_3k_rounded } from "@src/asset";

let ui = document.body.appendChild(new UI());

attachContextMenu(ui, [
  {
    label: "Open External Window",
    action: () => {
      let base = new Base();
      base.style.width = "100%";
      base.style.height = "100%";
      attachContextMenu(base, []);

      openWindowExternal({
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        content: base,
      });
    },
  },
  {
    label: "Open Virtual Window",
    action: () => {
      openWindowVirtual({
        opener: document.body,
        position: {
          left: 100,
          top: 100,
        },
        size: {
          width: 10,
          height: 10,
        },
        content: new Base(),
      });
    },
  },
]);

let testHideState = new State(Ok(false), true);
testHideState.subscribe((v) => {
  console.log(v);
});

// let window = openWindowVirtual({
//   opener: document.body,
//   title: "ornare arcu dui vivamus arcu felis bibendum ut tristique et",
//   toolTip: "2ornare arcu dui vivamus arcu felis bibendum ut tristique et",
//   layer: 1,
//   position: {
//     left: 2,
//     top: 2,
//   },
//   size: {
//     width: 10,
//     height: 10,
//   },
//   content: new Base(),
//   autoClose: true,
//   hide: testHideState,
//   writers: {
//     hide: testHideState,
//   },
// });

openWindowVirtual({
  opener: document.body,
  bar: false,
  position: {
    left: 14,
    top: 14,
  },
  size: {
    width: 10,
    height: 10,
  },
  content: new Base(),
});
openWindowVirtual({
  opener: document.body,
  icon: material_av_3k_rounded,
  position: {
    left: 2,
    top: 14,
  },
  size: {
    sizeable: "visible",
    width: 10,
    height: 10,
  },
  content: new Base(),
});
openWindowVirtual({
  opener: document.body,
  icon: material_av_3k_rounded,
  closable: false,
  position: {
    left: 14,
    top: 2,
  },
  size: {
    width: 10,
    height: 10,
  },
});

// let pageIP = new Content();
// //ui.content = pageIP;

// let test = new IP("IPV4", [192n, 168n, 1n, 1n]);
// console.warn(IP.ipv4ToNumber(test.ip));
// console.warn(IP.ipv4ToBigInt(test.ip));
// console.warn(IP.ipv4ToHex(test.ip));
// console.warn(IP.ipv4ToString(test.ip));

// console.warn(IP.numberToIpv4(IP.ipv4ToNumber(test.ip)));
// console.warn(IP.stringToipv4("1.1.1.1"));
// console.warn(IP.isIPv4("1.1.1.1"));
// console.warn("IPV6");
// let test2 = new IP("IPV6", [192n, 168n, 1n, 1n, 25n, 12n, 35n, 12n]);
// console.warn(IP.ipv6ToBigInt(test2.ip));
// console.warn(IP.bigintToIpv6(IP.ipv6ToBigInt(test2.ip)));
// console.warn(IP.ipv6ToString(test2.ip));
// console.warn(IP.stringToipv6("FFFF:1:1:1"));
