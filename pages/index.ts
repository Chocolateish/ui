import { attachContextMenu } from "@src/page/contextmenu";
import "./index.scss";
import { UI, openWindowExternal, openWindowVirtual } from "@src/page";
import { Base } from "@src/base";
import { State } from "@src/state";
import { Ok } from "@src/result";
import { material_av_3k_rounded } from "@src/asset";
import { Content } from "@src/page/content";
import {
  Button,
  DropDown,
  Lamp,
  Progress,
  Slider,
  Stepper,
  Switch,
  TextField,
  TitleField,
} from "@src/form";
import { BasicColors } from "@src/form/base";

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

// openWindowVirtual({
//   opener: document.body,
//   title: "ornare arcu dui vivamus arcu felis bibendum ut tristique et",
//   toolTip: "2ornare arcu dui vivamus arcu felis bibendum ut tristique et",
//   position: {
//     left: 2,
//     top: 2,
//   },
//   size: {
//     width: 10,
//     height: 10,
//   },
//   content: new Base(),
// });
// openWindowVirtual({
//   opener: document.body,
//   bar: false,
//   position: {
//     left: 14,
//     top: 14,
//   },
//   size: {
//     width: 10,
//     height: 10,
//   },
//   content: new Base(),
// });
// openWindowVirtual({
//   opener: document.body,
//   symbol: material_av_3k_rounded,
//   position: {
//     left: 2,
//     top: 14,
//   },
//   size: {
//     sizeable: "visible",
//     width: 10,
//     height: 10,
//   },
//   content: new Base(),
// });
// openWindowVirtual({
//   opener: document.body,
//   symbol: material_av_3k_rounded,
//   closable: false,
//   position: {
//     left: 14,
//     top: 2,
//   },
//   size: {
//     width: 10,
//     height: 10,
//   },
// });

let Lamps = new Content();
ui.content = Lamps;
Lamps.appendChild(
  new Lamp({
    label: "YOYO",
    value: true,
    text: "Testing attention please, would the real slim shady take a seconds to appease",
  })
);

Lamps.appendChild(
  new Switch({
    label: "YOYO",
    value: true,
  })
);

Lamps.appendChild(
  new TextField({
    label: "YOYO",
    value:
      "Testing attention please, would the real slim shady take a seconds to appease",
    textSize: 2,
  })
);

Lamps.appendChild(
  new TitleField({
    label: "YOYO",
    value:
      "Testing attention please, would the real slim shady take a seconds to appease",
    textSize: 2,
  })
);

Lamps.appendChild(
  new Button({
    label: "YOYO",
    value: false,
    text: "Testing attention please, would the real slim shady take a seconds to appease",
  })
);

Lamps.appendChild(
  new Progress({
    label: "YOYO",
    value: 10,
    min: 0,
    max: 100,
    unit: "%",
  })
);

Lamps.appendChild(
  new Slider({
    label: "YOYO",
    value: 10,
    min: 0,
    max: 100,
    unit: "%",
  })
);
Lamps.appendChild(
  new Stepper({
    label: "YOYO",
    value: 10,
    min: 0,
    max: 100,
    unit: "%",
  })
);

Lamps.appendChild(
  new DropDown({
    label: "YOYO",
    value: 10,
    selections: [
      { text: "YOYO", value: 10 },
      { text: "YOYO12", value: 12 },
    ],
  })
);
