import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'solid-js/web';
import PlayerNameForm from './PlayerNameForm';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
});

describe('PlayerNameForm', () => {
  it('disables submission until the name is valid', () => {
    const root = renderForm(vi.fn());
    const button = root.querySelector('button')!;
    const input = root.querySelector('input')!;

    expect(button.disabled).toBe(true);
    setInputValue(input, 'A');
    expect(button.disabled).toBe(false);
  });

  it('trims and submits the name with the button', () => {
    const onSubmit = vi.fn();
    const root = renderForm(onSubmit);
    const input = root.querySelector('input')!;

    setInputValue(input, '  Alice  ');
    root.querySelector('button')!.click();

    expect(onSubmit).toHaveBeenCalledWith('Alice');
  });

  it('submits a valid name with Enter', () => {
    const onSubmit = vi.fn();
    const root = renderForm(onSubmit);
    const input = root.querySelector('input')!;

    setInputValue(input, 'Bob');
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));

    expect(onSubmit).toHaveBeenCalledWith('Bob');
  });
});

function renderForm(onSubmit: (name: string) => void): HTMLDivElement {
  const root = document.createElement('div');
  document.body.append(root);
  dispose = render(() => <PlayerNameForm onSubmit={onSubmit} submitKey="ui:continue" />, root);
  return root;
}

function setInputValue(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new InputEvent('input', { bubbles: true }));
}
