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
  FormToggleButtons,
} from "@src/form";
import { State } from "@src/state";
import { Ok } from "@src/result";
import { FormInput, FormInputType } from "@src/form/input/input";
import { IP, IPType } from "@src/util";
import { at } from "cypress/types/lodash";
import { SVGViewport } from "@src/editor";

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

// let svgViewportContent = new Content();
// ui.content = svgViewportContent;
// svgViewportContent.appendChild(new SVGViewport({}));

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

// let testStateBool = new State(Ok(false), true);

// let Lamps = new Content();
// ui.content = Lamps;
// Lamps.appendChild(
//   new FormLamp({
//     label: "YOYO",
//     value: testStateBool,
//     text: "Testing attention please, would the real slim shady take a seconds to appease",
//   })
// );

// Lamps.appendChild(
//   new FormSwitch({
//     label: "YOYO",
//     value: testStateBool,
//     writer: testStateBool,
//   })
// );
// Lamps.appendChild(
//   new FormButton({
//     label: "YOYO",
//     value: testStateBool,
//     writer: testStateBool,
//     text: "Testing attention please, would the real slim shady take a seconds to appease",
//   })
// );

// Lamps.appendChild(
//   new FormTextField({
//     label: "YOYO",
//     value:
//       "Testing attention please, would the real slim shady take a seconds to appease",
//     size: 1,
//   })
// );

// Lamps.appendChild(
//   new FormTextField({
//     label: "YOYO",
//     value:
//       "Testing attention please, would the real slim shady take a seconds to appease",
//     title: true,
//   })
// );

// let testState = new State(Ok(10), true);
// let testStateUnit = new State(Ok("%"), true);
// setTimeout(() => {
//   testStateUnit.set(Ok("°C"));
// }, 1500);

// Lamps.appendChild(
//   new FormProgress({
//     label: "YOYO",
//     value: testState,
//     min: 0,
//     max: 100,
//     unit: testStateUnit,
//   })
// );

// Lamps.appendChild(
//   new FormSlider({
//     label: "YOYO",
//     description:
//       "Testing attention please, would the real slim shady take a seconds to appease",
//     live: true,
//     value: testState,
//     writer: testState,
//     min: 0,
//     max: 100,
//     step: 0.5,
//     decimals: 1,
//     unit: testStateUnit,
//   })
// );
// Lamps.appendChild(
//   new FormStepper({
//     label: "YOYO",
//     live: true,
//     value: testState,
//     writer: testState,
//     min: 0,
//     max: 100,
//     decimals: 1,
//     unit: testStateUnit,
//   })
// );

// let testStateSel = new State<10 | 12>(Ok(10), true);

// Lamps.appendChild(
//   new FormDropDown({
//     label: "YOYO",
//     value: testStateSel,
//     writer: testStateSel,
//     selections: [
//       { text: "YOYO", value: 10, details: "This is a test" },
//       { text: "YOYO12", value: 12 },
//     ],
//   })
// );

// let toggleButton = Lamps.appendChild(
//   new FormToggleButtons({
//     label: "YOYO",
//     description:
//       "Testing attention please, would the real slim shady take a seconds to appease",
//     value: testStateSel,
//     writer: testStateSel,
//     selections: [
//       { text: "YOYO", value: 10, details: "This is a test" },
//       { text: "YOYO12", value: 12 },
//     ],
//   })
// );

// Lamps.appendChild(
//   new FormInput({
//     label: "YOYO",
//     type: FormInputType.number,
//     value: testState,
//     writer: testState,
//     min: 0,
//     max: 100,
//   })
// );

// Lamps.appendChild(
//   new FormInput({
//     label: "YOYO",
//     type: FormInputType.number,
//     value: testState,
//     writer: testState,
//     live: true,
//     min: 0,
//     max: 100,
//     unit: testStateUnit,
//   })
// );

// let testStateText = new State(Ok("10"), true);
// testStateText.subscribe((v) => {
//   console.log(v);
// });

// Lamps.appendChild(
//   new FormInput({
//     label: "YOYO",
//     type: FormInputType.text,
//     value: testStateText,
//     writer: testStateText,
//   })
// );

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
