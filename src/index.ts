import { Selection, Tooltip } from '@/components';

import { defaultConfig, SVG_NAMESPACE, TOOLTIP_TEXT } from '@/constants';

import { ConfigOptions } from '@/types';

import '@/styles/index.scss';

class Annotation {
  readonly config: ConfigOptions;

  readonly element: string | HTMLElement;

  private container: HTMLDivElement;

  private pane: SVGElement;

  constructor(element: string | HTMLElement, config: ConfigOptions = defaultConfig) {
    this.config = config;
    this.element = element;
  }

  public init = (): HTMLElement => {
    const container = this.initContainer();
    container.appendChild(this.initImg());
    container.appendChild(this.initPane());
    container.appendChild(Tooltip.getInstance());
    return container;
  };

  private initContainer = (): HTMLDivElement => {
    this.container = document.createElement('div');
    this.container.classList.add('annotation-container');
    this.container.style.width = this.config.width;
    this.container.style.height = this.config.height;
    return this.container;
  };

  private initImg = (): HTMLElement => {
    if (typeof this.element === 'string') {
      const img = document.createElement('img');
      img.classList.add('annotation-img');
      img.src = this.element;
      return img;
    }
    return this.element;
  };

  private initPane = (): SVGElement => {
    const pane = document.createElementNS(SVG_NAMESPACE, 'svg');
    pane.classList.add('annotation-pane');
    pane.appendChild(document.createElementNS(SVG_NAMESPACE, 'defs'));

    const selection = new Selection(pane, { shape: 'rect' });

    pane.addEventListener('mousedown', selection.mouseDownHandler);
    pane.addEventListener('mousemove', selection.mouseMoveHandler);
    pane.addEventListener('mouseup', selection.mouseUpHandler);
    pane.addEventListener('mouseover', selection.mouseOverHandler);
    pane.addEventListener('mouseout', selection.mouseOutHandler);

    this.pane = pane;
    return pane;
  };
}

module.exports = Annotation;
