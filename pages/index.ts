import { Base } from "@src/base";
import "./index.scss";
import { Menubar } from "@src/menu";
import { DocumentHandler } from "@src/page";
import { ThemeEngine } from "@src/theme";

let documentHandler = new DocumentHandler();
new ThemeEngine(documentHandler);

let menubar = document.body.appendChild(new Menubar());
let test = new Base();
test.innerHTML = "Test";
setInterval(() => {
  test.innerHTML = new Date().toLocaleTimeString();
}, 1000);
menubar.appendItem(test, "end");

console.log("Hello World");
