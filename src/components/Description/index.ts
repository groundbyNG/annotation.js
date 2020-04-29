import { DESCRIPTION_PLACEHOLDER, DESCRIPTION_SUBMIT, DESCRIPTION_INDENT } from '@/constants';

import { DescriptionConfig } from '@/components/Description/types';

class Description {
  readonly description: HTMLElement;

  readonly textarea: HTMLTextAreaElement;

  readonly submitButton: HTMLButtonElement;

  private visible = false;

  private submitButtonVisible = false;

  private resolver: Function;

  constructor(descriptionConfig?: DescriptionConfig) {
    this.description = document.createElement('div');
    this.description.classList.add('annotation-description');

    this.textarea = document.createElement('textarea');
    this.textarea.classList.add('annotation-description__input');
    this.textarea.setAttribute('placeholder', DESCRIPTION_PLACEHOLDER);
    this.description.appendChild(this.textarea);

    this.submitButton = document.createElement('button');
    this.submitButton.classList.add('annotation-description__submit');
    this.submitButton.textContent = DESCRIPTION_SUBMIT;
    this.description.appendChild(this.submitButton);
  }

  public getElement = (): HTMLElement => this.description;

  public runEditor = (top: number, left: number): Promise<void | string> => new Promise((resolve) => {
    if (!this.description.classList.contains('annotation-description_open')) {
      this.description.classList.add('annotation-description_open');
      this.description.style.top = `${top + DESCRIPTION_INDENT}px`;
      this.description.style.left = `${left}px`;

      this.resolver = resolve;

      this.textarea.addEventListener('input', this.inputHandler);
      this.submitButton.addEventListener('click', this.clickHandler);
      this.visible = true;
    }
  });

  public closeEditor = (): void => {
    if (this.description.classList.contains('annotation-description_open')) {
      this.description.classList.remove('annotation-description_open');

      this.textarea.removeEventListener('input', this.inputHandler);
      this.textarea.value = '';

      this.submitButton.removeEventListener('click', this.clickHandler);

      this.visible = false;
      delete this.resolver;
    }
  };

  private inputHandler = (): void => {
    if (this.textarea.value && !this.submitButtonVisible) {
      this.showSubmit();
    } else if (!this.textarea.value) {
      this.hideSubmit();
    }
  };

  private clickHandler = (): void => {
    if (this.resolver) {
      this.resolver(this.textarea.value);
    }
    this.closeEditor();
  };

  private showSubmit = (): void => {
    if (!this.submitButton.classList.contains('annotation-description__submit-open')) {
      this.submitButton.classList.add('annotation-description__submit-open');
      this.submitButtonVisible = true;
    }
  };

  private hideSubmit = (): void => {
    if (this.submitButton.classList.contains('annotation-description__submit-open')) {
      this.submitButton.classList.remove('annotation-description__submit-open');
      this.submitButtonVisible = false;
    }
  };

  public isOpen = (): boolean => this.visible;
}

export default Description;
