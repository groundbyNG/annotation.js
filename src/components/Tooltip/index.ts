import { TOOLTIP_TEXT } from '@/constants';

class Tooltip {
  readonly tooltipElement: HTMLDivElement;

  private visible = false;

  constructor() {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.classList.add('annotation-tooltip');
    this.tooltipElement.textContent = TOOLTIP_TEXT;
  }

  public getElement = (): HTMLDivElement => this.tooltipElement;

  public openTooltip = (): void => {
    if (!this.tooltipElement.classList.contains('annotation-tooltip_open')) {
      this.tooltipElement.classList.add('annotation-tooltip_open');
      this.visible = true;
    }
  };

  public closeTooltip = (): void => {
    if (this.tooltipElement.classList.contains('annotation-tooltip_open')) {
      this.tooltipElement.classList.remove('annotation-tooltip_open');
      this.visible = false;
    }
  };

  public isOpen = (): boolean => this.visible;
}

export default Tooltip;
