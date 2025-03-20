import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URI || 'http://localhost:8080';

export default class CustomLinkTool implements BlockTool {
  api: API;
  data: { url: string; title: string; description: string; image: string };
  readOnly: boolean;

  constructor({ data, api, config }: BlockToolConstructorOptions) {
    this.api = api;
    this.data = data || { url: '', title: '', description: '', image: '' };
    this.readOnly = config?.readOnly || false;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Link',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M3.9 12c0 2.2 1.8 4 4 4h4v-2H7.9c-1.1 0-2-.9-2-2s.9-2 2-2h4V8h-4c-2.2 0-4 1.8-4 4zm6-1v2h4v-2h-4zm6-3h-4v2h4c1.1 0 2 .9 2 2s-.9-2-2-2h-4v2h4c2.2 0 4-1.8 4-4s-1.8-4-4-4z"/></svg>',
    };
  }

  async fetchMetadata(url: string) {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/link-preview`, {
        params: { url },
      });

      if (response.status === 200) {
        this.data = {
          url,
          title: response.data.title || '',
          description: response.data.description || '',
          image: response.data.image || '',
        };
      }
    } catch (error) {
      console.error('Error fetching link metadata:', error);
    }
  }

  render() {
    const container = document.createElement('div');
    container.classList.add('custom-link-tool');

    if (!this.readOnly) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Paste a link...';
      input.value = this.data.url;
      input.classList.add('custom-link-input');

      input.addEventListener('change', async () => {
        await this.fetchMetadata(input.value);
        this.updatePreview(container);
      });

      container.appendChild(input);
    }

    this.updatePreview(container);
    return container;
  }

  updatePreview(container: HTMLElement) {
    let preview = container.querySelector('.custom-link-preview');
    if (preview) {
      container.removeChild(preview);
    }

    if (!this.data.url) return;

    preview = document.createElement('div');
    preview.classList.add('custom-link-preview');

    const linkWrapper = document.createElement('a');
    linkWrapper.href = this.data.url;
    linkWrapper.target = '_blank';
    linkWrapper.rel = 'noopener noreferrer';
    linkWrapper.classList.add('custom-link-wrapper');

    if (this.data.image) {
      const image = document.createElement('img');
      image.src = this.data.image;
      image.classList.add('custom-link-image');
      linkWrapper.appendChild(image);
    }

    const textWrapper = document.createElement('div');
    textWrapper.classList.add('custom-link-text');

    const title = document.createElement('h3');
    title.textContent = this.data.title;
    title.classList.add('custom-link-title');

    const description = document.createElement('p');
    description.textContent = this.data.description;
    description.classList.add('custom-link-description');

    textWrapper.appendChild(title);
    textWrapper.appendChild(description);
    linkWrapper.appendChild(textWrapper);
    preview.appendChild(linkWrapper);

    container.appendChild(preview);
  }

  save() {
    return this.data;
  }
}
