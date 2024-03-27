import { version } from "../../package.json";
import { settingsInit } from "@src/page/settings";
import { libraryNameSpace } from "@src/util/globalsInternals";
import { StateEnumHelper, StateEnumHelperList, StateNumberHelper, StateWriteSync } from "@src/state";
import {
  material_hardware_mouse_rounded,
  material_image_edit_rounded,
  material_action_touch_app_rounded,
  material_device_light_mode_rounded,
  material_device_dark_mode_rounded,
} from "@src/asset";

//     _____            _        _
//    / ____|          | |      (_)
//   | |     ___  _ __ | |_ __ _ _ _ __   ___ _ __ ___
//   | |    / _ \| '_ \| __/ _` | | '_ \ / _ \ '__/ __|
//   | |___| (_) | | | | || (_| | | | | |  __/ |  \__ \
//    \_____\___/|_| |_|\__\__,_|_|_| |_|\___|_|  |___/
let containers: HTMLElement[] = [];

export function themeRegisterContainer(container: HTMLElement) {
  containers.push(container);
  applyAllToDoc(container);
  return container;
}

export function themeDeregisterContainer(container: HTMLElement) {
  let index = containers.indexOf(container);
  if (index == -1) return console.warn("Container not registered");
  containers.splice(index, 1);
  return container;
}

//     _____ ______ _______ _______ _____ _   _  _____  _____
//    / ____|  ____|__   __|__   __|_   _| \ | |/ ____|/ ____|
//   | (___ | |__     | |     | |    | | |  \| | |  __| (___
//    \___ \|  __|    | |     | |    | | | . ` | | |_ |\___ \
//    ____) | |____   | |     | |   _| |_| |\  | |__| |____) |
//   |_____/|______|  |_|     |_|  |_____|_| \_|\_____|_____/
const settings = settingsInit(libraryNameSpace, version, "Theme/UI", "Settings for UI elements and and color themes");

//Theme
export const enum Themes {
  Light = "light",
  Dark = "dark",
}
const themesInternal = {
  [Themes.Light]: {
    name: "Light",
    description: "Theme optimized for daylight",
    icon: material_device_light_mode_rounded,
  },
  [Themes.Dark]: {
    name: "Dark",
    description: "Theme optimized for night time",
    icon: material_device_dark_mode_rounded,
  },
} satisfies StateEnumHelperList;

const themeInternal = settings.addSetting(
  "theme",
  "Theme",
  "Theme to use for the UI",
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? Themes.Dark : Themes.Light,
  true,
  new StateEnumHelper(themesInternal)
);

themeInternal.subscribe((val) => {
  let value = val.unwrap;
  for (let i = 0; i < containers.length; i++) {
    applyThemeToDoc(containers[i], value);
  }
});
export const theme = themeInternal.StateWrite;

//Sets up automatic theme change based on operating system
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  themeInternal.write(e.matches ? Themes.Dark : Themes.Light);
});

//Scale
let scaleValue = 16;
const scaleInternal = settings.addSetting("scale", "Scale", "UI scale", 100, true, new StateNumberHelper(50, 300, "%", 0, 1));
scaleInternal.subscribe((val) => {
  scaleValue = (val.unwrap / 100) * 16;
  for (let i = 0; i < containers.length; i++) {
    applyScaleToDoc(containers[i], scaleValue);
  }
});
export const scale = scaleInternal as StateWriteSync<number>;

/**Converts the given rems to pixels */
export const remToPx = (rem: number) => {
  return rem * scaleValue;
};
/**Converts the given pixels to rems */
export const pxToRem = (px: number) => {
  return px / scaleValue;
};

//Scrollbar
export const enum ScrollbarModes {
  THIN = "thin",
  MEDIUM = "medium",
  WIDE = "wide",
}
const scrollbarModesInternal = {
  [ScrollbarModes.THIN]: {
    name: "Thin",
    description: "Thin modern scrollbar",
  },
  [ScrollbarModes.MEDIUM]: { name: "Medium", description: "Normal scrollbar" },
  [ScrollbarModes.WIDE]: {
    name: "Wide",
    description: "Large touch friendly scrollbar",
  },
} satisfies StateEnumHelperList;

const scrollBarModeInternal = settings.addSetting(
  "scrollbar",
  "Scrollbar Mode",
  "Size of the scrollbar to use",
  ScrollbarModes.THIN,
  true,
  new StateEnumHelper(scrollbarModesInternal)
);
scrollBarModeInternal.subscribe((val) => {
  let value = val.unwrap;
  for (let i = 0; i < containers.length; i++) {
    applyScrollbarToDoc(containers[i], value);
  }
});
export const scrollBarMode = scrollBarModeInternal.StateWrite;

//Input Mode
export const enum InputModes {
  MOUSE = "mouse",
  PEN = "pen",
  TOUCH = "touch",
}
const inputModesInternal = {
  [InputModes.MOUSE]: {
    name: "Mouse",
    description: "Mouse input",
    icon: material_hardware_mouse_rounded,
  },
  [InputModes.PEN]: {
    name: "Pen",
    description: "Pen input",
    icon: material_image_edit_rounded,
  },
  [InputModes.TOUCH]: {
    name: "Touch",
    description: "Touch input",
    icon: material_action_touch_app_rounded,
  },
} satisfies StateEnumHelperList;
const inputModeInternal = settings.addSetting(
  "input",
  "Input Mode",
  "Setting for preffered input mode, changes UI elements to be more optimized for the selected input mode",
  navigator.maxTouchPoints > 0 ? InputModes.TOUCH : InputModes.MOUSE,
  true,
  new StateEnumHelper(inputModesInternal)
);
inputModeInternal.subscribe((val) => {
  let value = val.unwrap;
  for (let i = 0; i < containers.length; i++) {
    applyInputToDoc(containers[i], value);
  }
});
export const inputMode = inputModeInternal.StateWrite;

//Graphics Level
export const enum GraphicsLevels {
  ALL = "all",
  SOME = "some",
  NONE = "none",
}
const graphicsLevelsInternal = {
  [GraphicsLevels.ALL]: { name: "All", description: "All animations" },
  [GraphicsLevels.SOME]: {
    name: "Some",
    description: "Only the lightest animations",
  },
  [GraphicsLevels.NONE]: { name: "None", description: "No animations" },
} satisfies StateEnumHelperList;

const graphicsLevelInternal = settings.addSetting(
  "graphics",
  "Graphics Level",
  "Setting for graphics level, changes the intensity of graphics used in the UI, like animations, opacity, etc.",
  GraphicsLevels.ALL,
  true,
  new StateEnumHelper(graphicsLevelsInternal)
);
graphicsLevelInternal.subscribe((val) => {
  let value = val.unwrap;
  for (let i = 0; i < containers.length; i++) {
    applyAnimationToDoc(containers[i], value);
  }
});

export const graphicsLevel = graphicsLevelInternal.StateWrite;

//   __      __        _       _     _
//   \ \    / /       (_)     | |   | |
//    \ \  / /_ _ _ __ _  __ _| |__ | | ___  ___
//     \ \/ / _` | '__| |/ _` | '_ \| |/ _ \/ __|
//      \  / (_| | |  | | (_| | |_) | |  __/\__ \
//       \/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
let nameTransformer: ((name: string) => string) | undefined;
export function themeSetNameTransform(transform: (name: string) => string) {
  nameTransformer = transform;
}

/**Initialises the settings for the package
 * @param packageName use import {name} from "../package.json"
 * @param name name of group formatted for user reading
 * @param description a description of what the setting group is about*/
export function themeInitVariableRoot(packageName: string, name: string, description: string) {
  if (nameTransformer) {
    packageName = nameTransformer(packageName);
  }
  bottomGroups[packageName] = new ThemeVariableGroup(packageName, name, description);
  return bottomGroups[packageName];
}

/**Group of settings should never be instantiated manually use initSettings*/
export class ThemeVariableGroup {
  private pathID: string;
  private variables: {
    [key: string]: {
      name: string;
      desc: string;
      vars: { [key: string]: string };
      type: keyof ThemeVariableType;
      typeParams: ThemeVariableType[keyof ThemeVariableType];
      example?: () => Element;
    };
  } = {};
  private subGroups: { [key: string]: ThemeVariableGroup } = {};
  readonly name: string;
  readonly description: string;

  constructor(path: string, name: string, description: string) {
    this.pathID = path;
    this.name = name;
    this.description = description;
  }

  /**Makes a variable subgroup for this group
   * @param id unique identifier for this subgroup in the parent group
   * @param name name of group formatted for user reading
   * @param description a description of what the setting group is about formatted for user reading*/
  makeSubGroup(id: string, name: string, description: string) {
    if (id in this.subGroups) {
      throw new Error("Sub group already registered " + id);
    } else {
      return (this.subGroups[id] = new ThemeVariableGroup(this.pathID + id, name, description));
    }
  }

  /**Makes a variable
   * @param id unique identifier for this variable in the group
   * @param name name of variable formatted for user reading
   * @param description a description of what the variable is about formatted for user reading
   * @param light value for light mode
   * @param dark value for dark mode
   * @param type type of variable for editing
   * @param typeParams */
  makeVariable<K extends keyof ThemeVariableType>(
    id: string,
    name: string,
    description: string,
    light: string,
    dark: string,
    type: K,
    typeParams?: ThemeVariableType[K],
    example?: () => Element
  ) {
    if (id in this.variables) {
      throw new Error("Settings already registered " + id);
    }
    let key = "--" + this.pathID + id;
    let variable = (this.variables[key] = {
      name,
      desc: description,
      vars: { [Themes.Light]: light, [Themes.Dark]: dark },
      type,
      typeParams,
      example,
    });
    applySingleProperty(key, variable.vars);
    return;
  }

  /**Applies the groups
   * @param style unique identifier for this variable in the group
   * @param theme name of variable formatted for user reading*/
  applyThemes(style: CSSStyleDeclaration, theme: string) {
    for (const key in this.variables) {
      style.setProperty(key, this.variables[key].vars[theme]);
    }
    for (const key in this.subGroups) {
      this.subGroups[key].applyThemes(style, theme);
    }
  }
}

/**Defines the parameters for a variable type */
interface ThemeVariableType {
  /**Text variable,  */
  String: undefined;
  /**Color variable */
  Color: undefined;
  /**Time variable */
  Time: {
    /**Minimum time in milliseconds */
    min: number;
    /**Maximum time in milliseconds */
    max: number;
  };
  /**Angle variable */
  Angle: { min: number; max: number };
  /**Length variable*/
  Length: { min: number; max: number };
  /**Number variable*/
  Number: { min: number; max: number };
  /**Ratio*/
  Ratio:
    | {
        width: { min: number; max: number };
        height: { min: number; max: number };
      }
    | number;
}

let bottomGroups: { [key: string]: ThemeVariableGroup } = {};

//                         _ _
//       /\               | (_)
//      /  \   _ __  _ __ | |_  ___ _ __ ___
//     / /\ \ | '_ \| '_ \| | |/ _ \ '__/ __|
//    / ____ \| |_) | |_) | | |  __/ |  \__ \
//   /_/    \_\ .__/| .__/|_|_|\___|_|  |___/
//            | |   | |
//            |_|   |_|
function applySingleProperty(key: string, variable: { [s: string]: string }) {
  let themeBuff = theme.get().unwrap;
  for (let i = 0; i < containers.length; i++) {
    containers[i].style.setProperty(key, variable[themeBuff]);
  }
}

/**This applies the current theme to a document*/
function applyAllToDoc(container: HTMLElement) {
  applyScrollbarToDoc(container, <ScrollbarModes>scrollBarMode.get().unwrap);
  applyThemeToDoc(container, theme.get().unwrap);
  applyInputToDoc(container, <InputModes>inputMode.get().unwrap);
  applyScaleToDoc(container, scale.get().unwrap * 0.16);
  applyAnimationToDoc(container, <GraphicsLevels>graphicsLevel.get().unwrap);
}

function applyScrollbarToDoc(container: HTMLElement, scroll: ScrollbarModes) {
  container.style.setProperty(
    "--scrollbar",
    {
      [ScrollbarModes.THIN]: "0.4rem",
      [ScrollbarModes.MEDIUM]: "1rem",
      [ScrollbarModes.WIDE]: "1.875rem",
    }[scroll]
  );
}
function applyAnimationToDoc(container: HTMLElement, anim: GraphicsLevels) {
  container.classList.remove("graphics-all", "graphics-some");
  switch (anim) {
    case GraphicsLevels.ALL:
      container.classList.add("graphics-all");
    case GraphicsLevels.SOME:
      container.classList.add("graphics-some");
      break;
  }
}
function applyThemeToDoc(container: HTMLElement, theme: Themes) {
  for (const key in bottomGroups) bottomGroups[key].applyThemes(container.style, theme);
}
function applyScaleToDoc(container: HTMLElement, scale: number) {
  container.style.fontSize = scale + "px";
}
function applyInputToDoc(container: HTMLElement, mode: InputModes) {
  let style = container.style;
  style.setProperty("--mouse", "0");
  style.setProperty("--pen", "0");
  style.setProperty("--touch", "0");
  container.classList.remove("mouse", "pen", "touch");
  switch (mode) {
    case InputModes.MOUSE:
      style.setProperty("--mouse", "1");
      container.classList.add("mouse");
      break;
    case InputModes.PEN:
      style.setProperty("--pen", "1");
      container.classList.add("pen");
      break;
    case InputModes.TOUCH:
      style.setProperty("--touch", "1");
      container.classList.add("touch");
      break;
  }
}

themeRegisterContainer(document.documentElement);
