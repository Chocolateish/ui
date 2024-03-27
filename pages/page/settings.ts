import "./index.css";
import { name, version } from "../../package.json";
import { StateAsync } from "@src/state";
import { settingsInit, settingsSetNameTransform } from "@src/page";
import { crel } from "@src/base";

settingsSetNameTransform((name) => {
  return name + "2";
});

let settings = settingsInit(name, version, "Test Settings", "Description of test settings");

(async () => {
  let state = new StateAsync<number>(new Promise((a) => setTimeout(a, 500, 1)));
  state.write(2);
  console.log(await state);

  let TestBoolSetting = settings.addSetting("TestBool", "Test Bool", "Bool Test", false, true);
  let valueBool = crel("input");
  valueBool.type = "checkbox";
  document.body.appendChild(valueBool);
  valueBool.checked = (await TestBoolSetting).unwrap;
  valueBool.addEventListener("change", (e) => {
    TestBoolSetting.write(valueBool.checked);
  });

  let TestNumberSetting = settings.addSetting<number>(
    "TestNumber",
    " Test Number",
    "Number Test",
    99,
    true,
    undefined,
    (_oldValue, oldVersion) => {
      switch (oldVersion) {
        case "0.1.1":
          return 100;
        case "0.1.5":
          return 50;
        default:
          return 10;
      }
    }
  );
  let valueNumber = crel("input");
  valueNumber.type = "number";
  document.body.appendChild(valueNumber);
  valueNumber.value = String((await TestNumberSetting).unwrap);
  valueNumber.addEventListener("change", async (e) => {
    TestNumberSetting.write(Number(valueNumber.value));
    valueNumber.value = String((await TestNumberSetting).unwrap);
  });

  let TestStringSetting = settings.addSettingAsync(
    "TestString",
    "",
    "",
    new Promise<string>((a) => {
      setTimeout(() => {
        a("yo");
      }, 5000);
    }),
    true
  );
  let valueString = crel("input");
  document.body.appendChild(valueString);
  valueString.value = (await TestStringSetting).unwrap;
  valueString.addEventListener("change", async (e) => {
    TestStringSetting.write(valueString.value);
    valueString.value = (await TestStringSetting).unwrap;
  });
})();
