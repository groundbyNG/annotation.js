import { SVG_NAMESPACE } from '@/constants';
import {
  RectangleSelection,
  Rectangle,
  Tooltip,
  Description,
} from '@/components';
import { AnnotationType, ConfigOptions } from '@/types';

class Pane {
  readonly pane: SVGElement;

  readonly annotations: AnnotationType[];

  private currentAnnotation: AnnotationType;

  readonly config: ConfigOptions;

  private selection: RectangleSelection;

  private tooltip: Tooltip;

  private description: Description;

  constructor(config: ConfigOptions, tooltip: Tooltip, description: Description) {
    this.pane = document.createElementNS(SVG_NAMESPACE, 'svg');
    this.pane.classList.add('annotation-pane');
    this.pane.appendChild(document.createElementNS(SVG_NAMESPACE, 'defs'));

    this.config = config;
    this.tooltip = tooltip;
    this.description = description;

    this.annotations = [];
    this.currentAnnotation = this.createAnnotation(this.config.selectionShape);

    switch (this.config.selectionShape) {
      case 'rect':
      default: {
        this.selection = new RectangleSelection(
          this.pane,
          this.currentAnnotation.shape,
        );
      }
    }

    this.pane.addEventListener('mousedown', this.mouseDownHandler);
    this.pane.addEventListener('mousemove', this.mouseMoveHandler);
    this.pane.addEventListener('mouseup', this.mouseUpHandler);
    this.pane.addEventListener('mouseover', this.mouseOverHandler);
    this.pane.addEventListener('mouseout', this.mouseOutHandler);

    // this.pane.addEventListener('annotation-selected', () => {});
    // this.pane.addEventListener('annotation-description', () => {});
  }

  public mouseDownHandler = (event: MouseEvent): void => {
    console.log('mousedown');
    this.tooltip.closeTooltip();
    this.selection.mouseDownHandler(event);
  };

  public mouseMoveHandler = (event: MouseEvent): void => {
    this.selection.mouseMoveHandler(event);
  };

  public mouseUpHandler = async (): Promise<void> => {
    console.log('mouseup');
    this.selection.mouseUpHandler();
    if (this.config.editableShape) {
      await this.editShape();
    }
    await this.editDescription();
  };

  public mouseOverHandler = (): void => {
    if (!this.tooltip.isOpen() && !this.selection.getSelectionState()) {
      this.tooltip.openTooltip();
    }
  };

  public mouseOutHandler = (): void => {
    if (this.tooltip.isOpen()) {
      this.tooltip.closeTooltip();
    }
  };

  public getElement = (): SVGElement => this.pane;

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

  private addAnnotation = (annotation: AnnotationType): void => {
    if (annotation) {
      this.annotations.push(annotation);
      annotation.shape.addVisibleStyles();
      this.pane.appendChild(annotation.shape.getElement());
      this.currentAnnotation = this.createAnnotation(this.config.selectionShape);
      console.log(this.getAnnotations());
    }
  };

  private editShape = async (): Promise<void> => {};

  private editDescription = async (): Promise<void> => {
    if (this.currentAnnotation.shape) {
      // specific-selection calculation
      const { shape } = this.currentAnnotation;
      const top = shape.getY() + shape.getHeight();
      const left = shape.getX();

      this.currentAnnotation.payload = await this.description.runEditor(top, left);
      this.selection.removeSelection();
      this.addAnnotation(this.currentAnnotation);
    }
  };
}

export default Pane;
