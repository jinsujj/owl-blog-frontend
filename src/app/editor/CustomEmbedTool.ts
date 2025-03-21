import { API, BlockAPI, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface CustomEmbedData {
  url: string;
}

export default class CustomEmbedTool {
  private data: CustomEmbedData;
  private wrapper: HTMLElement;
  private readOnly: boolean;
  private api: API;
  private block: BlockAPI;

  constructor({ data, api, block, readOnly }: BlockToolConstructorOptions<CustomEmbedData>) {
    this.data = data || { url: '' };
    this.api = api;
    this.block = block;
    this.readOnly = readOnly;
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'custom-embed-wrapper';
  }

  render() {
    this.wrapper.innerHTML = '';

    if (this.readOnly) {
      if (this.data.url) {
        const iframe = this._createIframe(this.data.url);
        if (iframe) {
          this.wrapper.appendChild(iframe);
        }
      }
      return this.wrapper;
    }

    const input = document.createElement('input');
    input.placeholder = 'YouTube URL을 입력하세요';
    input.value = this.data.url || '';
    input.style.width = '100%';
    input.style.padding = '8px';
    input.style.fontSize = '14px';

    input.addEventListener('change', () => {
      this.data.url = input.value;
      this._renderIframe();
    });

    this.wrapper.appendChild(input);
    this._renderIframe();

    return this.wrapper;
  }

  _renderIframe() {
    const iframe = this._createIframe(this.data.url);
    if (!iframe) return;

    const existing = this.wrapper.querySelector('iframe');
    if (existing) {
      existing.remove();
    }

    this.wrapper.appendChild(iframe);
  }

  _createIframe(url: string): HTMLIFrameElement | null {
    const videoId = this._extractYoutubeId(url);
    if (!videoId) return null;

    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '400';
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    return iframe;
  }

  _extractYoutubeId(url: string | undefined): string | null {
		if (!url) return null; 
	
		const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	}

  save(): CustomEmbedData {
    return {
      url: this.data.url,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'YouTube',
      icon: '<svg width="20" height="20"><circle cx="10" cy="10" r="5" fill="red" /></svg>',
    };
  }
}
