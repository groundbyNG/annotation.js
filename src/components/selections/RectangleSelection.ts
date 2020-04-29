import { Rectangle } from '@/components';

import { SVG_NAMESPACE } from '@/constants';

import { calcRelativeCoords } from '@/helpers';

import { Point } from '@/types';

class RectangleSelection {
  readonly pane: SVGElement;

  private shape: Rectangle;

  readonly mask: SVGElement;

  private startCoordinates: Point;

  private shadow: SVGElement;

  private isSelectionStart = false;

  constructor(pane: SVGElement, shape: Rectangle) {
    this.pane = pane;
    this.shape = shape;
    this.mask = this.createMask(this.shape.getElement());
    this.addSelectionMask(this.mask);
  }

  public mouseDownHandler = ({ clientX, clientY }: MouseEvent): void => {
    if (!this.isSelectionStart) {
      this.startCoordinates = calcRelativeCoords(this.pane, clientX, clientY);

      // changing visible shape coordinates
      this.shape.setX(this.startCoordinates.x);
      this.shape.setY(this.startCoordinates.y);
      this.shape.setWidth(0);
      this.shape.setHeight(0);

      this.initSelection();
    }
  };

  public mouseMoveHandler = ({ clientX, clientY }: MouseEvent): void => {
    if (this.isSelectionStart) {
      console.log('mousemove');
      const endCoordinates = calcRelativeCoords(this.pane, clientX, clientY);
      if (endCoordinates.x - this.startCoordinates.x < 0
        && endCoordinates.y - this.startCoordinates.y < 0) {
        this.shape.setX(endCoordinates.x);
        this.shape.setY(endCoordinates.y);
        this.shape.setWidth(this.startCoordinates.x - endCoordinates.x);
        this.shape.setHeight(this.startCoordinates.y - endCoordinates.y);
      } else if (endCoordinates.y - this.startCoordinates.y < 0) {
        this.shape.setY(endCoordinates.y);
        this.shape.setWidth(endCoordinates.x - this.startCoordinates.x);
        this.shape.setHeight(this.startCoordinates.y - endCoordinates.y);
      } else if (endCoordinates.x - this.startCoordinates.x < 0) {
        this.shape.setWidth(this.startCoordinates.x - endCoordinates.x);
        this.shape.setHeight(endCoordinates.y - this.startCoordinates.y);
        this.shape.setX(endCoordinates.x);
      } else {
        this.shape.setWidth(endCoordinates.x - this.startCoordinates.x);
        this.shape.setHeight(endCoordinates.y - this.startCoordinates.y);
      }
    }
  };

  public mouseUpHandler = (): Promise<boolean> => new Promise((resolve) => {
    this.isSelectionStart = false;
    resolve(
      Math.abs(this.shape.getX() - this.shape.getX() + this.shape.getWidth()) > 1
      && Math.abs(this.shape.getY() - this.shape.getY() + this.shape.getHeight()) > 1,
    );
  });

  // creating mask DOM element
  private createMask = (shape: SVGElement): SVGElement => {
    const mask = document.createElementNS(SVG_NAMESPACE, 'mask');
    mask.setAttribute('id', 'annotation-shadow');

    // create shadow element
    const rect = document.createElementNS(SVG_NAMESPACE, 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'rgba(255,255,255,0.3)');

    mask.appendChild(rect);
    mask.appendChild(shape);
    return mask;
  };

  // add container for shadow layout, define start selection
  private initSelection = (): void => {
    if (this.shadow) { this.shadow = null; }
    this.shadow = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.shadow.setAttribute('width', '100%');
    this.shadow.setAttribute('height', '100%');
    this.shadow.setAttribute('mask', 'url(#annotation-shadow)');
    this.pane.appendChild(this.shadow);
    this.isSelectionStart = true;
  };

  // remove container for shadow layout, set default selection flags
  public removeSelection = (): void => {
    if (this.shadow) {
      this.pane.removeChild(this.shadow);
      this.shadow = null;
      this.isSelectionStart = false;
    }
  };

  public getSelectionState = (): boolean => this.isSelectionStart;

  // add created mask to pane in DOM
  private addSelectionMask = (mask: SVGElement): void => {
    this.pane.firstChild.appendChild(mask);
  };

  public setCurrentAnnotation = (shape: Rectangle): void => {
    this.shape = shape;
    this.mask.appendChild(this.shape.getElement());
  }
}

export default RectangleSelection;
