import { SVG_NAMESPACE } from '@/constants';
import { RectangleSelection, Rectangle } from '@/components';
import { AnnotationType, ConfigOptions } from '@/types';

class Pane {
  readonly pane: SVGElement;

  private annotations: AnnotationType[];

  private currentAnnotation: AnnotationType;

  constructor(config: ConfigOptions) {
    this.pane = document.createElementNS(SVG_NAMESPACE, 'svg');
    this.pane.classList.add('annotation-pane');
    this.pane.appendChild(document.createElementNS(SVG_NAMESPACE, 'defs'));

    this.currentAnnotation = this.createAnnotation(config.selectionShape);

    let selection;
    switch (config.selectionShape) {
      case 'rect':
      default: {
        selection = new RectangleSelection(
          this.addSelectionMask,
          this.addShadow,
          this.removeShadow,
          this.getPaneCoordinates,
          this.currentAnnotation.shape,
        );
      }
    }

    this.pane.addEventListener('mousedown', selection.mouseDownHandler);
    this.pane.addEventListener('mousemove', selection.mouseMoveHandler);
    this.pane.addEventListener('mouseup', selection.mouseUpHandler);
    this.pane.addEventListener('mouseover', selection.mouseOverHandler);
    this.pane.addEventListener('mouseout', selection.mouseOutHandler);

    this.pane.addEventListener('annotation-selected', () => {});
    this.pane.addEventListener('annotation-edited', () => {});
  }

  public getPaneElement = (): SVGElement => this.pane;

  public getAnnotations = (): AnnotationType[] => this.annotations;

  private createAnnotation = (selectionShape: string): AnnotationType => {
    let shape;
    switch (selectionShape) {
      case 'rect':
      default: {
        shape = new Rectangle();
      }
    }

    return {
      shape,
      payload: null,
    };
  };

  private addSelectionMask = (mask: SVGElement): void => {
    this.pane.firstChild.appendChild(mask);
  };

  private addShadow = (shadow: SVGElement): void => {
    this.pane.appendChild(shadow);
  };

  private removeShadow = (shadow: SVGElement): void => {
    this.pane.removeChild(shadow);
  };

  private getPaneCoordinates = (): DOMRect => this.pane.getBoundingClientRect();
}

export default Pane;
