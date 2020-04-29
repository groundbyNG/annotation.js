// calculate relative to element coordinates
import { Point } from '@/types/Point';

const calcRelativeCoords = (
  relativeElement: HTMLElement | SVGElement,
  clientX: number,
  clientY: number,
): Point => {
  const { left, top } = relativeElement.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;
  return { x, y };
};

export default calcRelativeCoords;
