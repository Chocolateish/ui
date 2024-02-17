import { openContextMenu } from "@src/page/contextmenu";
import "./index.scss";
import { UI } from "@src/page";
import { Base } from "@src/base";

document.body.appendChild(new UI());
openContextMenu(new Base(), 10, 10);
