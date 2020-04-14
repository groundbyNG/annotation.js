import { TOOLTIP_TEXT } from '@/constants';

const tooltip = document.createElement('div');
tooltip.classList.add('annotation-tooltip');
tooltip.textContent = TOOLTIP_TEXT;

let visible = false;

const Tooltip = {
  getInstance: (): HTMLDivElement => tooltip,
  openTooltip: (): void => {
    if (!tooltip.classList.contains('annotation-tooltip_open')) {
      tooltip.classList.add('annotation-tooltip_open');
      visible = true;
    }
  },
  closeTooltip: (): void => {
    if (tooltip.classList.contains('annotation-tooltip_open')) {
      tooltip.classList.remove('annotation-tooltip_open');
      visible = false;
    }
  },
  isOpen: (): boolean => visible,
};

Object.freeze(Tooltip);
export default Tooltip;
