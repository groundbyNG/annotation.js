import { ConfigOptions } from './types';
import { defaultConfig } from './constants';
import './styles/index.scss';

class Annotation {
  readonly config: ConfigOptions;

  readonly element: string | HTMLElement;

  constructor(element: string | HTMLElement, config: ConfigOptions = defaultConfig) {
    this.config = config;
    this.element = element;
  }

  public init = (): HTMLElement => {
    const container = document.createElement('div');
    container.classList.add('annotation-container');
    container.style.width = this.config.width;
    container.style.height = this.config.height;

    if (typeof this.element === 'string') {
      const img = document.createElement('img');
      img.classList.add('annotation-img');
      img.src = this.element;
      container.appendChild(img);
    } else {
      container.appendChild(this.element);
    }

    container.appendChild(this.initPane());
    return container;
  };

  private initPane = (): SVGElement => {
    const pane = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pane.classList.add('annotation-pane');
    return pane;
  }
}

module.exports = Annotation;
