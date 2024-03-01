import { attachContextMenu } from "@src/page/contextmenu";
import "./index.scss";
import { UI, openWindowExternal, openWindowVirtual } from "@src/page";
import { Base } from "@src/base";
import { State } from "@src/state";
import { Ok } from "@src/result";

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
        x: 100,
        y: 100,
        width: 10,
        height: 10,
        content: new Base(),
      });
    },
  },
]);
