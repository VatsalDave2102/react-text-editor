import isUrl from "is-url";
import { Editor, Transforms } from "slate";
import { ImageELement } from "../types";

export const ImageMethods = {
	// function to check url is of image or not
	async isImageUrl(url: string) {
		if (!url) return false;
		if (!isUrl(url)) return false;

		let isImage = false;
		try {
			isImage = (await ImageMethods.validUrl(url)) as boolean;
		} catch (error) {
			isImage = false;
		}

		return isImage;
	},

	// function to load image url
	validUrl(url: string) {
		const img = new Image();
		img.src = url;
		return new Promise((resolve) => {
			img.onerror = () => resolve(false);
			img.onload = () => resolve(true);
		});
	},

	// function to add image in editor
	insertImage(editor: Editor, url: string, altText: string, width?: number) {
		// creating empty text
		const text = { text: "" };

		// creating image object
		const image: ImageELement = {
			type: "image",
			url,
			children: [text],
			alt: altText || "",
			align: "left",
			width: width || 300,
		};

		// inserting image node in editor
		Transforms.insertNodes(editor, image);

		// inserting empty paragraph after image
		Transforms.insertNodes(editor, {
			type: "paragraph",
			children: [{ text: "" }],
		});
	},
};
