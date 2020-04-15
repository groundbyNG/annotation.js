import { SVG_NAMESPACE } from '@/constants';

class Rectangle {
  private x: string;

  private y: string;

  private width: string;

  private height: string;

  readonly element: SVGElement;

  constructor() {
    this.element = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.element.setAttribute('width', '0');
    this.element.setAttribute('height', '0');
    this.element.setAttribute('fill', 'black');
  }

  public setX = (x: number): void => {
    this.x = `${x}`;
    this.element.setAttribute('x', this.x);
  };

  public setY = (y: number): void => {
    this.y = `${y}`;
    this.element.setAttribute('y', this.y);
  };

  public setWidth = (width: number): void => {
    this.width = `${width}`;
    this.element.setAttribute('width', this.width);
  };

  public setHeight = (height: number): void => {
    this.height = `${height}`;
    this.element.setAttribute('height', this.height);
  };

  public getElement = (): SVGElement => this.element;

  public getX = (): number => +this.x;

  public getY = (): number => +this.y;

  public getWidth = (): number => +this.width;

  public getHeight = (): number => +this.height;

}

export default Rectangle;
