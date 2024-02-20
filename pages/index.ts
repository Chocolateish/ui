import { attachContextMenu } from "@src/page/contextmenu";
import "./index.scss";
import { UI } from "@src/page";
import { Base } from "@src/base";
import { State } from "@src/state";
import { Ok } from "@src/result";

let ui = document.body.appendChild(new UI());
attachContextMenu(
  document.body,
  Array(10)
    .fill(0)
    .map((e, i) => {
      if (i === 5) {
        return 5;
      } else if (i === 1) {
        return {
          label: "Item " + i,
          sub: Array(25)
            .fill(0)
            .map((e, i) => {
              return {
                label: "Item " + i,
                action: () => {
                  console.log("Item " + i);
                },
              };
            }),
        };
      } else if (i === 7) {
        return {
          label: "Item " + i,
          sub: Array(5)
            .fill(0)
            .map((e, i) => {
              return {
                label: "Item asdf asfd asdf asd fa sdf asdfa sfd   " + i,
                action: () => {
                  console.log("Item asd fa sdfasdf as dfa sdfa sdf asdf" + i);
                },
              };
            }),
        };
      } else if (i === 8) {
        return {
          label: "Item " + i,
          action: () => {
            console.log("Item " + i);
          },
          disabled: true,
          shortcut: { ctrl: true, keys: ["a", "b"] },
        };
      } else {
        return {
          label: "Item " + i,
          checked: true,
          action: () => {
            console.log("Item " + i);
          },
        };
      }
    })
);
