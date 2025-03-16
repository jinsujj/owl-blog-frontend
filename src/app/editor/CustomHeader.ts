import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

/**
 * CustomHeader 블록
 * - 빨간색 세로줄이 있는 헤더 블록
 * - EditorJS에서 사용 가능
 */
export default class CustomHeader implements BlockTool {
  private data: { text: string };
  private wrapper: HTMLElement | null;
  private input: HTMLInputElement;
  private api: API;
	private readOnly: boolean;

	static get isReadOnlySupported() {
    return true;  
  }

  static get toolbox() {
    return {
      title: 'Custom Header',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2z"/></svg>'
    };
  }

  constructor({ data, api, readOnly }: BlockToolConstructorOptions) {
    this.api = api;
    this.data = data || { text: '' };
    this.wrapper = null;
    this.input = document.createElement('input');
		this.readOnly = readOnly;
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('custom-header');

		if (this.readOnly) {
      this.wrapper.setAttribute("contenteditable", "false");
    }

    this.input.type = 'text';
    this.input.placeholder = 'Enter a header...';
    this.input.value = this.data.text || '';
    this.input.classList.add('custom-header-input');

    this.input.addEventListener('input', () => {
      this.data.text = this.input.value;
    });

    this.wrapper.appendChild(this.input);
    return this.wrapper;
  }

  save(): { text: string } {
    return {
      text: this.input.value
    };
  }
}
