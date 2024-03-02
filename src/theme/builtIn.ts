import "./builtIn.scss";
import { themeInitVariableRoot } from "./engine";
import { blue, grey } from "@src/asset";

export let root = themeInitVariableRoot(
  "chui",
  "Shared Variables",
  "Shared variables across features"
);

let colors = root.makeSubGroup("clr", "Colors", "Color variables");
colors.makeVariable(
  "l1",
  "UI Layer 1",
  "Color of the first layer of the UI",
  grey[900],
  grey[50],
  "Color",
  undefined
);
colors.makeVariable(
  "l2",
  "UI Layer 2",
  "Color of the second layer of the UI",
  grey[700],
  grey[200],
  "Color",
  undefined
);
colors.makeVariable(
  "l3",
  "UI Layer 3",
  "Color of the third layer of the UI",
  grey[500],
  grey[400],
  "Color",
  undefined
);
colors.makeVariable(
  "l4",
  "UI Layer 4",
  "Color of the fourth layer of the UI",
  grey[300],
  grey[600],
  "Color",
  undefined
);
colors.makeVariable(
  "l5",
  "UI Layer 5",
  "Color of the fourth layer of the UI",
  grey[100],
  grey[800],
  "Color",
  undefined
);
colors.makeVariable(
  "brd",
  "UI border",
  "Color of the borders of the UI",
  grey[50],
  grey[900],
  "Color",
  undefined
);
colors.makeVariable(
  "fcs",
  "UI focused element",
  "Color of the focused element of the UI",
  blue[300],
  blue[600],
  "Color",
  undefined
);
colors.makeVariable(
  "sbclr",
  "UI active element",
  "Color of the active (tab selected) element of the UI",
  grey[300],
  grey[600],
  "Color",
  undefined
);
