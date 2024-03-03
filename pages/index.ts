import { attachContextMenu } from "@src/page/contextmenu";
import "./index.scss";
import { UI, openWindowExternal, openWindowVirtual } from "@src/page";
import { Base } from "@src/base";
import { State } from "@src/state";
import { Ok } from "@src/result";
import { material_av_3k_rounded } from "@src/asset";

let ui = document.body.appendChild(new UI());

attachContextMenu(ui, [
  {
    label: "Open External Window",
    action: () => {
      openWindowExternal({
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        content: new Base(),
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

openWindowVirtual({
  opener: document.body,
  title: "ornare arcu dui vivamus arcu felis bibendum ut tristique et",
  toolTip: "2ornare arcu dui vivamus arcu felis bibendum ut tristique et",
  position: {
    left: 2,
    top: 2,
  },
  size: {
    width: 10,
    height: 10,
  },
  content: new Base(),
});
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
  symbol: material_av_3k_rounded,
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
  symbol: material_av_3k_rounded,
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
