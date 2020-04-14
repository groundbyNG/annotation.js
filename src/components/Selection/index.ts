import { Tooltip } from '@/components';

import { SVG_NAMESPACE } from '@/constants';

import { SelectionOptions } from './types';

class Selection {
  readonly pane: SVGElement;

  // private shape: SVGElement;

  private shadow: SVGElement;

  private visibleShape: SVGElement;

  private isSelectionStart = false;

  private startCoordinates;

  private endCoordinates;

  constructor(pane: SVGElement, options: SelectionOptions) {
    this.pane = pane;
    this.pane.firstChild.appendChild(this.createMask(options.shape));

    // this.shape = document.createElementNS(SVG_NAMESPACE, options.shape);
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
    this.visibleShape.setAttribute('x', this.startCoordinates.shapeX);
    this.visibleShape.setAttribute('y', this.startCoordinates.shapeY);
    this.visibleShape.setAttribute('width', '0');
    this.visibleShape.setAttribute('height', '0');

    // add container for shadow layout
    this.shadow = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.shadow.setAttribute('width', '100%');
    this.shadow.setAttribute('height', '100%');
    this.shadow.setAttribute('mask', 'url(#annotation-shadow)');
    this.pane.appendChild(this.shadow);

    // this.shape.setAttribute('x', shapeX);
    // this.shape.setAttribute('y', shapeY);
    // this.shape.setAttribute('height', '0');
    // this.shape.setAttribute('width', '0');
  };

  public mouseMoveHandler = ({ clientX, clientY }: MouseEvent): void => {
    if (this.isSelectionStart) {
      console.log('mousemove');
      this.endCoordinates = this.calculateCoordinates(clientX, clientY);
      if (this.endCoordinates.shapeX - this.startCoordinates.shapeX < 0) {
        const temp = this.endCoordinates;
        this.endCoordinates = this.startCoordinates;
        this.startCoordinates = temp;
      }
      this.visibleShape.setAttribute('x', this.startCoordinates.shapeX);
      this.visibleShape.setAttribute('y', this.startCoordinates.shapeY);
      this.visibleShape.setAttribute('width', `${this.endCoordinates.shapeX - this.startCoordinates.shapeX}`);
      this.visibleShape.setAttribute('height', `${this.endCoordinates.shapeY - this.startCoordinates.shapeY}`);
    }
  };


  public mouseUpHandler = (event: MouseEvent): void => {
    console.log('mouseup', event);
    this.isSelectionStart = false;
    if (this.shadow) {
      this.pane.removeChild(this.shadow);
      this.shadow = null;
    }
  };

  private createMask = (shape: string): SVGElement => {
    const mask = document.createElementNS(SVG_NAMESPACE, 'mask');
    mask.setAttribute('id', 'annotation-shadow');

    // create shadow element
    const rect = document.createElementNS(SVG_NAMESPACE, 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'rgba(255,255,255,0.3)');
    // create visible area
    this.visibleShape = document.createElementNS(SVG_NAMESPACE, shape);
    this.visibleShape.setAttribute('width', '0');
    this.visibleShape.setAttribute('height', '0');
    this.visibleShape.setAttribute('fill', 'black');
    mask.appendChild(rect);
    mask.appendChild(this.visibleShape);
    return mask;
  };

  private calculateCoordinates = (clientX: number, clientY: number): Record<string, string> => {
    const { left, top } = this.pane.getBoundingClientRect();
    const shapeX = `${clientX - left}`;
    const shapeY = `${clientY - top}`;
    return {
      shapeX,
      shapeY,
    };
  }
}

export default Selection;
