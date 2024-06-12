import isUrl from "is-url";
import { deserialize } from "../utils/deserialize";
import { CustomEditor } from "../custom-editor/custom-editor";
import { Editor, Element, Node, Point, Range, Transforms } from "slate";

// creating a custom plugin by overriding editor methods, for more info https://docs.slatejs.org/concepts/08-plugins
// to handle inline links, buttons and badges,
// to handle image, youtube embed insertion by copying link into editor
// to handler check-list deletion
export const withCustomFeatures = (editor: Editor) => {
	// extracting editor methods
	const { insertData, isVoid, insertText, isInline, deleteBackward } = editor;

	// overrinding isVoid to return image and video type elements as void elements
	editor.isVoid = (element) => {
		return ["image", "video"].includes(element.type) ? true : isVoid(element);
	};

	// overriding isLine to return link, and badge as inline elements
	editor.isInline = (element: Element) =>
		["link", "badge"].includes(element.type) || isInline(element);

	// overriding insertText to convert inserted text to URL
	editor.insertText = (text: string) => {
		if (text && isUrl(text)) {
			CustomEditor.link.wrapLink(editor, text);
		} else {
			insertText(text);
		}
	};

	// overriding insertData to deal with multiple purpose
	// such as drag and drop for images, pasting URL of images
	// pasting URL of youtube videos or pasting a simple link
	editor.insertData = async (data) => {
		// get text and html data from editor
		const text = data.getData("text/plain");
		const html = data.getData("text/html");

		// extracting files
		const { files } = data;

		// boolean to check if text inserted in data is image, video or link
		const isVideo = CustomEditor.embedVideo.isVideoURL(text);
		const isImage = await CustomEditor.image.isImageUrl(text);
		const isLink = text && isUrl(text);

		// condition to check if file is inserted in editor
		if (files && files.length > 0) {
			for (const file of files) {
				const reader = new FileReader();
				const [mime] = file.type.split("/");

				// to check that inserted file is an image
				if (mime === "image") {
					reader.addEventListener("load", () => {
						const url = reader.result;
						// inserting image using fileReader if data is url
						if (url) {
							CustomEditor.image.insertImage(editor, url as string, "Image");
						}
					});

					reader.readAsDataURL(file);
				}
			}
		} else if (isVideo) {
			// if pasted link is of youtube video, generate embed link
			const embedUrl = CustomEditor.embedVideo.getEmbedURL(text);
			// insert embed video element in editor
			embedUrl && CustomEditor.embedVideo.insertEmbedVideo(editor, embedUrl);
		} else if (isImage) {
			// if link is an image, insert image to editor
			CustomEditor.image.insertImage(editor, text, "URL image");
		} else if (isLink) {
			// if text is an link
			CustomEditor.link.wrapLink(editor, text);
		} else if (html) {
			// getting parsed html
			const parsed = new DOMParser().parseFromString(html, "text/html");

			// deserialinzing html
			const fragment = deserialize(parsed.body);

			// inserting html in editor
			Transforms.insertFragment(editor, fragment as Node[]);
			return;
		} else {
			insertData(data);
		}
	};

	// overriding editor.deleteBackward to
	// insert a blank paragraph when a check list item is deleted in place of it,
	// remove the badge element from editor when text inside it gets empty
	editor.deleteBackward = (...args) => {
		// getting selected state of editor
		const { selection } = editor;

		// if selection is not collapsed
		if (selection && Range.isCollapsed(selection)) {
			// if selected state is check-list-item store get it match
			const [match] = Editor.nodes(editor, {
				match: (n) =>
					!Editor.isEditor(n) &&
					Element.isElement(n) &&
					n.type === "check-list-item",
			});

			// if match found
			if (match) {
				const [, path] = match;

				// start is starting point of check-list-item
				const start = Editor.start(editor, path);

				// if selected state's starting point is same as matched check-list-item's starting point
				if (Point.equals(selection?.anchor, start)) {
					// create a new node
					const newProperties: Partial<Element> = {
						type: "paragraph",
					};

					// insert paragraph node
					Transforms.setNodes(editor, newProperties, {
						match: (n) =>
							!Editor.isEditor(n) &&
							Element.isElement(n) &&
							n.type === "check-list-item",
					});
					return;
				}
			}
		}

		if (selection && Range.isCollapsed(selection)) {
			// getting badge node
			const [match] = Editor.nodes(editor, {
				match: (n) =>
					!Editor.isEditor(n) && Element.isElement(n) && n.type === "badge",
				at: selection,
			});

			if (match) {
				// extracting path of badge node
				const [, path] = match;

				// defining badge's start point
				const start = Editor.start(editor, path);

				// comparing offset of point to delete badge when the last letter of badge is deleted
				if (selection.anchor.offset === start.offset + 1) {
					Transforms.removeNodes(editor, { at: path });
					return;
				}
			}
		}
		deleteBackward(...args);
	};

	return editor;
};
