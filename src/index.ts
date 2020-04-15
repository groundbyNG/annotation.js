import { Tooltip, Pane } from '@/components';

import { defaultConfig } from '@/constants';

import { ConfigOptions } from '@/types';

import '@/styles/index.scss';

class Annotable {
  readonly config: ConfigOptions;

  readonly element: string | HTMLElement;

  private container: HTMLDivElement;

  private pane: Pane;

  constructor(element: string | HTMLElement, config: ConfigOptions = defaultConfig) {
    this.config = config;
    this.element = element;
    this.pane = new Pane(this.config);
  }

  public init = (): HTMLElement => {
    const container = this.initContainer();
    container.appendChild(this.initImg());
    container.appendChild(this.pane.getPaneElement());
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
}

module.exports = Annotable;
