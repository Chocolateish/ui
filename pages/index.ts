import { attachContextMenu } from "@src/page/contextmenu";
import "./index.scss";
import { UI, openWindowExternal, openWindowVirtual } from "@src/page";
import { Base } from "@src/base";
import { Content } from "@src/page/content";
import {
  FormButton,
  FormDropDown,
  FormLamp,
  FormProgress,
  FormSlider,
  FormStepper,
  FormSwitch,
  FormTextField,
  FormToggleButton,
} from "@src/form";

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
//   icon: material_av_3k_rounded,
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
//   icon: material_av_3k_rounded,
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
  new FormLamp({
    label: "YOYO",
    value: true,
    text: "Testing attention please, would the real slim shady take a seconds to appease",
  })
);

Lamps.appendChild(
  new FormSwitch({
    label: "YOYO",
    value: true,
  })
);

Lamps.appendChild(
  new FormTextField({
    label: "YOYO",
    value:
      "Testing attention please, would the real slim shady take a seconds to appease",
    size: 1,
  })
);

Lamps.appendChild(
  new FormTextField({
    label: "YOYO",
    value:
      "Testing attention please, would the real slim shady take a seconds to appease",
    title: true,
  })
);

Lamps.appendChild(
  new FormButton({
    label: "YOYO",
    value: false,
    text: "Testing attention please, would the real slim shady take a seconds to appease",
  })
);

Lamps.appendChild(
  new FormProgress({
    label: "YOYO",
    value: 10,
    min: 0,
    max: 100,
    unit: "%",
  })
);

Lamps.appendChild(
  new FormSlider({
    label: "YOYO",
    value: 10,
    min: 0,
    max: 100,
    unit: "%",
  })
);
Lamps.appendChild(
  new FormStepper({
    label: "YOYO",
    value: 10,
    min: 0,
    max: 100,
    unit: "%",
  })
);

Lamps.appendChild(
  new FormDropDown({
    label: "YOYO",
    value: 10,
    selections: [
      { text: "YOYO", value: 10, details: "This is a test" },
      { text: "YOYO12", value: 12 },
    ],
  })
);

let toggleButton = Lamps.appendChild(
  new FormToggleButton({
    label: "YOYO",
    value: 10,
    selections: [
      { text: "YOYO", value: 10, details: "This is a test" },
      { text: "YOYO12", value: 12 },
    ],
  })
);
