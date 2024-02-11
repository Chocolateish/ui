import "./index.scss";
import { DocumentHandler } from "@src/page";
import * as theme from "@src/theme";

let documentHandler = new DocumentHandler(document);
let themeEngine = new theme.ThemeEngine(documentHandler);

//@ts-ignore
document.body.theme = theme;

let scaleBox = document.body.appendChild(document.createElement("div"));
scaleBox.id = scaleBox.innerHTML = "ScaleBox";
