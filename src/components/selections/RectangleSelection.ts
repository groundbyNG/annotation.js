import { Tooltip, Rectangle } from '@/components';

import { SVG_NAMESPACE } from '@/constants';

import { Point } from '@/types';

class RectangleSelection {
  private shape: Rectangle;

  private startCoordinates: Point;

  private shadow: SVGElement;

  private isSelectionStart = false;

  readonly addShadow: (shadow: SVGElement) => void;

  readonly removeShadow: (shadow: SVGElement) => void;

  readonly getPaneCoordinates: () => DOMRect;

  constructor(
    addSelectionMask: (mask: SVGElement) => void,
    addShadow: (shadow: SVGElement) => void,
    removeShadow: (shadow: SVGElement) => void,
    getPaneCoordinates: () => DOMRect,
    shape: Rectangle,
  ) {
    this.addShadow = addShadow;
    this.removeShadow = removeShadow;
    this.getPaneCoordinates = getPaneCoordinates;
    this.shape = shape;
    addSelectionMask(this.createMask(this.shape.getElement()));
  }

  public mouseOverHandler = (): void => {
    if (!Tooltip.isOpen() && !this.isSelectionStart) {
      Tooltip.openTooltip();
    }
  };

  public mouseOutHandler = (): void => {
    if (Tooltip.isOpen()) {
      Tooltip.closeTooltip();
    }
  };

  public mouseDownHandler = ({ clientX, clientY }: MouseEvent): void => {
    console.log('mousedown');
    this.isSelectionStart = true;
    Tooltip.closeTooltip();

    this.startCoordinates = this.calculateCoordinates(clientX, clientY);

    // changing visible shape coordinates
    this.shape.setX(this.startCoordinates.x);
    this.shape.setY(this.startCoordinates.y);
    this.shape.setWidth(0);
    this.shape.setHeight(0);
    // add container for shadow layout
    this.shadow = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.shadow.setAttribute('width', '100%');
    this.shadow.setAttribute('height', '100%');
    this.shadow.setAttribute('mask', 'url(#annotation-shadow)');
    this.addShadow(this.shadow);
  };

  public mouseMoveHandler = ({ clientX, clientY }: MouseEvent): void => {
    if (this.isSelectionStart) {
      console.log('mousemove');
      const endCoordinates = this.calculateCoordinates(clientX, clientY);
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

  public mouseUpHandler = (event: MouseEvent): void => {
    console.log('mouseup', event);
    this.isSelectionStart = false;
    if (this.shadow) {
      this.removeShadow(this.shadow);
      this.shadow = null;
    }
  };

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

  private calculateCoordinates = (clientX: number, clientY: number): Point => {
    const { left, top } = this.getPaneCoordinates();
    const x = clientX - left;
    const y = clientY - top;
    return { x, y };
  }
}

export default RectangleSelection;
