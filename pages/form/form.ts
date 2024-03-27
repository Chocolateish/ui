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
  FormInput,
  FormInputType,
} from "@src/form";
import { Content } from "@src/page/content";
import { Ok } from "@src/result";
import { State } from "@src/state";

export let form = new Content();

let testStateBool = new State(Ok(false), true);

form.appendChild(
  new FormLamp({
    label: "YOYO",
    value: testStateBool,
    text: "Testing attention please, would the real slim shady take a seconds to appease",
  })
);

form.appendChild(
  new FormSwitch({
    label: "YOYO",
    value: testStateBool,
    writer: testStateBool,
  })
);
form.appendChild(
  new FormButton({
    label: "YOYO",
    value: testStateBool,
    writer: testStateBool,
    text: "Testing attention please, would the real slim shady take a seconds to appease",
  })
);

form.appendChild(
  new FormTextField({
    label: "YOYO",
    value: "Testing attention please, would the real slim shady take a seconds to appease",
    size: 1,
  })
);

form.appendChild(
  new FormTextField({
    label: "YOYO",
    value: "Testing attention please, would the real slim shady take a seconds to appease",
    title: true,
  })
);

let testState = new State(Ok(10), true);
let testStateUnit = new State(Ok("%"), true);
setTimeout(() => {
  testStateUnit.set(Ok("°C"));
}, 1500);

form.appendChild(
  new FormProgress({
    label: "YOYO",
    value: testState,
    min: 0,
    max: 100,
    unit: testStateUnit,
  })
);

form.appendChild(
  new FormSlider({
    label: "YOYO",
    description: "Testing attention please, would the real slim shady take a seconds to appease",
    live: true,
    value: testState,
    writer: testState,
    min: 0,
    max: 100,
    step: 0.5,
    decimals: 1,
    unit: testStateUnit,
  })
);
form.appendChild(
  new FormStepper({
    label: "YOYO",
    live: true,
    value: testState,
    writer: testState,
    min: 0,
    max: 100,
    decimals: 1,
    unit: testStateUnit,
  })
);

let testStateSel = new State<10 | 12>(Ok(10), true);

form.appendChild(
  new FormDropDown({
    label: "YOYO",
    value: testStateSel,
    writer: testStateSel,
    selections: [
      { text: "YOYO", value: 10, details: "This is a test" },
      { text: "YOYO12", value: 12 },
    ],
  })
);

let toggleButton = form.appendChild(
  new FormToggleButtons({
    label: "YOYO",
    description: "Testing attention please, would the real slim shady take a seconds to appease",
    value: testStateSel,
    writer: testStateSel,
    selections: [
      { text: "YOYO", value: 10, details: "This is a test" },
      { text: "YOYO12", value: 12 },
    ],
  })
);

form.appendChild(
  new FormInput({
    label: "YOYO",
    type: FormInputType.number,
    value: testState,
    writer: testState,
    min: 0,
    max: 100,
  })
);

form.appendChild(
  new FormInput({
    label: "YOYO",
    type: FormInputType.number,
    value: testState,
    writer: testState,
    live: true,
    min: 0,
    max: 100,
    unit: testStateUnit,
  })
);

let testStateText = new State(Ok("10"), true);
testStateText.subscribe((v) => {
  console.log(v);
});

form.appendChild(
  new FormInput({
    label: "YOYO",
    type: FormInputType.text,
    value: testStateText,
    writer: testStateText,
  })
);
