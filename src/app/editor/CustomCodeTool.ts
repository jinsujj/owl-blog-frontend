import { API, BlockTool, BlockToolConstructorOptions } from "@editorjs/editorjs";

class CustomCodeTool implements BlockTool {
  api: API;
  data: { code: string; language: string };

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.api = api;
    this.data = data || { code: "", language: "javascript" };
  }

  render() {
    const wrapper = document.createElement("div");

    const languageSelector = document.createElement("select");
    ["javascript", "python", "java", "html"].forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = lang;
      if (this.data.language === lang) option.selected = true;
      languageSelector.appendChild(option);
    });

    const textarea = document.createElement("textarea");
    textarea.textContent = this.data.code;

    languageSelector.addEventListener("change", (e) => {
      this.data.language = (e.target as HTMLSelectElement).value;
    });

    textarea.addEventListener("input", (e) => {
      this.data.code = (e.target as HTMLTextAreaElement).value;
    });

    wrapper.appendChild(languageSelector);
    wrapper.appendChild(textarea);

    return wrapper;
  }

  save(blockContent: HTMLElement) {
    return {
      code: this.data.code,
      language: this.data.language,
    };
  }
}

export default CustomCodeTool;
