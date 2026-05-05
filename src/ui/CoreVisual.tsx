import type { Component } from 'solid-js';
import { getCoreVisual } from '../models/CoreVisual';
import { getZoidById } from '../models/Zoid';

interface CoreVisualProps {
  class?: string;
  speciesId: string;
}

const CoreVisual: Component<CoreVisualProps> = (props) => {
  const layers = () => getCoreVisual(getZoidById(props.speciesId));
  const px = () => `${layers().sizePx}px`;
  const colorPx = () => `${layers().sizePx + 12}px`;
  const colorOffset = () => `${-6}px`;

  return (
    <div
      class={`core-visual ${props.class ?? ''}`}
      style={{
        height: px(),
        '-webkit-mask-image': `url(${layers().shape})`,
        '-webkit-mask-repeat': 'no-repeat',
        '-webkit-mask-size': `${px()} ${px()}`,
        'mask-image': `url(${layers().shape})`,
        'mask-size': `${px()} ${px()}`,
        width: px(),
      }}
    >
      <img class="core-visual-shape" src={layers().shape} style={{ height: px(), width: px() }} alt="" />
      <img class="core-visual-color" src={layers().color} style={{ height: colorPx(), left: colorOffset(), top: colorOffset(), width: colorPx() }} alt="" />
      <img class="core-visual-pattern" src={layers().pattern} style={{ height: px(), width: px() }} alt="" />
    </div>
  );
};

export default CoreVisual;
