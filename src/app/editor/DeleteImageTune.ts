import { API, BlockAPI, BlockTune } from "@editorjs/editorjs";
import { removeThumbnail } from "../api/thumbnailApi";


interface ImageBlockData {
	data? : {
		file?: {
			url?: string;
		}
	}
}

export default class DeleteImageTune implements BlockTune {
  private api: API;
  private block: BlockAPI;

  constructor({ api, block }: { api: API; block: BlockAPI }) {
    this.api = api;
    this.block = block;
  }

  static get isTune(): boolean {
    return true;
  }

  async getBlockData(): Promise<ImageBlockData | null> {
    try {
      const savedData = await this.block.save(); 
      return savedData as ImageBlockData;
    } catch (error) {
      console.error("Failed to get block data:", error);
      return null;
    }
  }

  render(): HTMLButtonElement {
    const button = document.createElement("button");
    button.innerHTML = "🗑 Delete Image";
    button.classList.add("ce-toolbar__button");

    button.addEventListener("click", async () => {
      const blockData = await this.getBlockData(); 
			console.log(blockData?.data?.file?.url);
      const imageUrl = blockData?.data?.file?.url;
      if (imageUrl) {
        try {
          console.log("Deleting image:", imageUrl);
          const fileName = imageUrl.split("/").pop();
          if (fileName) {
            await removeThumbnail(fileName);

						const blockIndex = this.api.blocks.getCurrentBlockIndex();
            console.log("Current block index:", blockIndex);
						if (blockIndex !== undefined && blockIndex >= 0) {
              this.api.blocks.delete(blockIndex);
            } else {
              console.error("Block index not found!");
            }
          } else {
            console.error("Invalid file name extracted from URL");
          }
        } catch (error) {
          console.error("Failed to delete image:", error);
        }
      } else {
        console.warn("No image URL found in block data.");
      }
    });

    return button;
  }
}
