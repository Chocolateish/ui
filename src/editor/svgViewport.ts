import "./svgViewport.scss";
import { Base, BaseOptions, crel, defineElement } from "@src/base";
import { crsvgel, rectangleFromCorner, svgsvg } from "@src/svg";

const zoomMax = 200;
const zoomMin = 0.02;
const zoomDecimals = 2;

const canvasDefaultWidth = 50;
const canvasDefaultHeight = 50;

const canvasBorderPercievedThickness = 3;

export class SVGViewport extends Base {
  static elementName() {
    return "svgviewport";
  }

  #moverContainer = crel("div");
  #mover = crsvgel("svg");
  #canvasBorder: SVGRectElement = rectangleFromCorner(
    1,
    1,
    canvasDefaultWidth + canvasBorderPercievedThickness,
    canvasDefaultHeight + canvasBorderPercievedThickness,
    0
  );
  #canvas: SVGSVGElement = svgsvg(canvasDefaultWidth, canvasDefaultHeight);

  #zoom: number = 1;
  #x: number = 0;
  #y: number = 0;
  #width: number = 0;
  #height: number = 0;
  #widthHalf: number = 0;
  #heightHalf: number = 0;
  #realx: number = 0;
  #realy: number = 0;

  #canvasWidth: number = canvasDefaultWidth;
  #canvasHeight: number = canvasDefaultHeight;

  constructor(options: BaseOptions) {
    super(options);
    this.appendChild(this.#moverContainer);
    this.#moverContainer.appendChild(this.#mover);
    this.#mover.appendChild(this.#canvasBorder);
    this.#mover.appendChild(this.#canvas);

    this.#moverContainer.onpointerdown = (e) => {
      if (e.button === 1 || e.pointerType === "touch") {
        let lastX = e.offsetX;
        let lastY = e.offsetY;
        this.#moverContainer.setPointerCapture(e.pointerId);
        this.#moverContainer.onpointerup = (ev) => {
          this.#moverContainer.releasePointerCapture(ev.pointerId);
          this.#moverContainer.onpointerup = null;
          this.#moverContainer.onpointermove = null;
        };
        this.#moverContainer.onpointermove = (ev) => {
          this.xOffsetReal = ev.offsetX - lastX;
          this.yOffsetReal = ev.offsetY - lastY;
          lastX = ev.offsetX;
          lastY = ev.offsetY;
        };
      }
    };
    this.#moverContainer.onwheel = (e) => {
      let oldZoom = this.#zoom;
      let cX = e.offsetX - this.#widthHalf;
      let cY = e.offsetY - this.#heightHalf;
      if (e.deltaY > 0) {
        this.zoom = this.#zoom / 1.25;
        let offset = 1 - Number((this.#zoom / oldZoom).toFixed(3));
        this.xOffsetReal = cX * offset;
        this.yOffsetReal = cY * offset;
      } else {
        this.zoom = this.#zoom * 1.25;
        let offset = Number((this.#zoom / oldZoom).toFixed(3)) - 1;
        this.xOffsetReal = -cX * offset;
        this.yOffsetReal = -cY * offset;
      }
    };

    //Handles updating width and height
    new ResizeObserver((e) => {
      this.#width = e[0].contentBoxSize[0].inlineSize;
      this.#height = e[0].contentBoxSize[0].blockSize;
      this.#moverContainer.style.width = this.#width + "px";
      this.#moverContainer.style.height = this.#height + "px";
      this.#widthHalf = this.#width / 2;
      this.#heightHalf = this.#height / 2;
      this.#mover.style.left = this.#widthHalf + "px";
      this.#mover.style.top = this.#heightHalf + "px";
      this.#mover.setAttribute("width", this.#widthHalf + "px");
      this.#mover.setAttribute("height", this.#heightHalf + "px");
      this.#mover.setAttribute(
        "viewBox",
        -this.#x + " " + -this.#y + " " + this.#widthHalf / this.#zoom + " " + this.#heightHalf / this.#zoom
      );
    }).observe(this);
  }

  set zoom(zoom: number) {
    this.#mover.setAttribute("viewBox", -this.#x + " " + -this.#y + " " + this.#widthHalf / zoom + " " + this.#heightHalf / zoom);
    this.#zoom = zoom;
    let border = canvasBorderPercievedThickness * Math.pow(zoom, Math.cos(1.8) * 4.401368);
    this.#canvasBorder.setAttribute("stroke-width", String(border));
  }
  get zoom() {
    return this.#zoom;
  }

  set x(x: number) {
    this.#mover.setAttribute("viewBox", -x + " " + -this.#y + " " + this.#widthHalf / this.#zoom + " " + this.#heightHalf / this.#zoom);
    this.#x = x;
    this.#realx = x * this.#zoom;
  }

  get x() {
    return this.#x;
  }

  set y(y: number) {
    this.#mover.setAttribute("viewBox", -this.#x + " " + -y + " " + this.#widthHalf / this.#zoom + " " + this.#heightHalf / this.#zoom);
    this.#y = y;
    this.#realy = y * this.#zoom;
  }
  get y() {
    return this.#y;
  }

  set canvasWidth(width: number) {
    this.#canvas.setAttribute("width", String(width));
    this.#canvas.setAttribute("viewBox", "0 0 " + width + " " + this.#canvasHeight);
    this.#canvasBorder.setAttribute("x", String(-canvasBorderPercievedThickness / 2));
    this.#canvasBorder.setAttribute("width", String(width + canvasBorderPercievedThickness));
  }
  get canvasWidth() {
    return this.#canvasWidth;
  }

  set canvasHeight(height: number) {
    this.#canvas.setAttribute("height", String(height));
    this.#canvas.setAttribute("viewBox", "0 0 " + this.#canvasWidth + " " + height);
    this.#canvasBorder.setAttribute("y", String(-canvasBorderPercievedThickness / 2));
    this.#canvasBorder.setAttribute("height", String(height + canvasBorderPercievedThickness));
  }
  get canvasHeight() {
    return this.#canvasHeight;
  }

  /**Changes the position of the canvas by an amount in the x axis using real coordinates*/
  set xOffsetReal(x: number) {
    this.x = this.#x + x / this.#zoom;
  }

  /**Changes the position of the canvas by an amount in the y axis using real coordinates*/
  set yOffsetReal(y: number) {
    this.y = this.#y + y / this.#zoom;
  }
}
defineElement(SVGViewport);
