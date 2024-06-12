import {
	Editable,
	RenderElementProps,
	RenderLeafProps,
	Slate,
} from "slate-react";
import { useCallback } from "react";
import { Descendant, Editor } from "slate";

import {
	modifyInlineCursor,
	selectText,
	toggleMarkFromKb,
} from "../utils/keydown-handlers";
import {
	MarkButton,
	BlockButton,
	AddLinkButton,
	EmbedVideoButton,
	RemoveLinkButton,
	InsertBadgeButton,
	InsertImageButton,
	SearchInput,
} from "./toolbar-buttons";
import {
	BlockButtons,
	FontButtons,
	MarkButtons,
	SpecialButtons,
} from "../../types";
import Leaf from "./Leaf";
import Toolbar from "./Toolbar";
import Element from "./Element";
import HoveringToolbar from "./HoveringToolbar";
import { useDecorate } from "../hooks/useDecorate";
import { CustomEditor } from "../custom-editor/custom-editor";
import FontSizeButton from "./toolbar-buttons/FontSizeButton";
import FontFamilyButton from "./toolbar-buttons/FontFamilyButton";

interface EditorProps {
	editor: Editor;
	editorKey: React.Key;
	initialValue: Descendant[];
	onChange: ((value: Descendant[]) => void) | undefined;
	markButtons: MarkButtons[];
	blockButtons: BlockButtons[];
	specialButtons: SpecialButtons[];
	fontButtons: FontButtons[];
	hoverToolbar?: boolean;
}

const EditorComponent: React.FC<EditorProps> = ({
	editor,
	editorKey,
	initialValue,
	onChange,
	markButtons,
	blockButtons,
	specialButtons,
	fontButtons,
	hoverToolbar,
}) => {
	// custom hook to highlight searched text
	const { setSearch, decorate } = useDecorate();

	// defining a rendering function based on the element passed to 'props',
	// useCallback here to memoize the function for subsequent renders.
	// this will render our custom elements according to props
	const renderElement = useCallback((props: RenderElementProps) => {
		return <Element {...props} />;
	}, []);

	// a memoized leaf rendering function
	// this will render custom leaf elements according to props
	const renderLeaf = useCallback((props: RenderLeafProps) => {
		return <Leaf {...props} />;
	}, []);

	const renderMarkButtons = (type: MarkButtons) => {
		switch (type) {
			case "bold":
				return <MarkButton format="bold" icon="format_bold" />;
			case "italic":
				return <MarkButton format="italic" icon="format_italic" />;
			case "underline":
				return <MarkButton format="underline" icon="format_underlined" />;
			case "code":
				return <MarkButton format="code" icon="code" />;
			default:
				return null;
		}
	};

	const renderBlockButtons = (type: BlockButtons) => {
		switch (type) {
			case "heading-one":
				return <BlockButton format="heading-one" icon="looks_one" />;
			case "heading-two":
				return <BlockButton format="heading-two" icon="looks_two" />;
			case "block-quote":
				return <BlockButton format="block-quote" icon="format_quote" />;
			case "bulleted-list":
				return (
					<BlockButton
						key={type}
						format="bulleted-list"
						icon="format_list_bulleted"
					/>
				);
			case "numbered-list":
				return (
					<BlockButton
						key={type}
						format="numbered-list"
						icon="format_list_numbered"
					/>
				);
			case "check-list-item":
				return (
					<BlockButton key={type} format="check-list-item" icon="check_box" />
				);
			case "left":
				return (
					<BlockButton key={type} format="left" icon="format_align_left" />
				);
			case "center":
				return (
					<BlockButton key={type} format="center" icon="format_align_center" />
				);
			case "right":
				return (
					<BlockButton key={type} format="right" icon="format_align_right" />
				);
			case "justify":
				return (
					<BlockButton
						key={type}
						format="justify"
						icon="format_align_justify"
					/>
				);
			default:
				return null;
		}
	};

	const renderSpecialButtons = (type: SpecialButtons) => {
		switch (type) {
			case "add-link":
				return <AddLinkButton key={type} />;
			case "remove-link":
				return <RemoveLinkButton key={type} />;
			case "embed-video":
				return <EmbedVideoButton key={type} />;
			case "badge":
				return <InsertBadgeButton key={type} />;
			case "image":
				return <InsertImageButton key={type} />;
			case "search-input":
				return <SearchInput key={type} setSearch={setSearch} />;

			default:
				return null;
		}
	};

	const renderFontButton = (type: FontButtons) => {
		switch (type) {
			case "font-size":
				return <FontSizeButton key={type} editor={editor} />;
			case "font-family":
				return <FontFamilyButton key={type} editor={editor} />;
			default:
				return null;
		}
	};

	return (
		<div className="bg-white mx-auto rounded-md my-10 w-4/5">
			{/*  render the slate context, must be rendered above any editable
			components, it can provide editor state to other components like
			toolbars, menus */}
			<Slate
				editor={editor}
				key={editorKey}
				initialValue={initialValue}
				// dispatch action to store value in localStorage on change
				onChange={onChange}
			>
				{/* Toolbar */}
				<Toolbar>
					{/* Mark buttons */}
					<div className="flex flex-row gap-x-3 border-r pr-2">
						{markButtons.map((button) => renderMarkButtons(button))}
					</div>
					{/* Block buttons */}
					<div className="flex flex-row gap-x-3 border-r pr-2">
						{blockButtons.map((button) => renderBlockButtons(button))}
					</div>

					{/* Inline button, badge, Image buttons */}
					<div className="flex flex-row gap-x-3 border-r pr-2">
						{specialButtons.map((button) => renderSpecialButtons(button))}
					</div>

					<div className="flex flex-row gap-x-3 border-r pr-2">
						{fontButtons.map((button) => renderFontButton(button))}
					</div>
				</Toolbar>
				{hoverToolbar && <HoveringToolbar />}
				{/* editable component */}
				<div className="p-3 focus-within:ring-2 focus-within:ring-neutral-200 focus-within:ring-inset border">
					<Editable
						spellCheck
						autoFocus
						decorate={decorate}
						renderLeaf={renderLeaf}
						renderElement={renderElement}
						className="outline-none max-h-[730px] overflow-y-auto"
						onKeyDown={(event) => {
							// adding formatting using keyboard shortcuts
							toggleMarkFromKb(event, editor);

							// modifying cursor for inline elements such as badge
							modifyInlineCursor(event, editor);

							// select text using keyboard shortcut
							selectText(event, editor);
						}}
						onDOMBeforeInput={(event: InputEvent) => {
							switch (event.inputType) {
								case "fomartBold":
									event.preventDefault();
									return CustomEditor.mark.toggleMark(editor, "bold");
								case "formatItalic":
									event.preventDefault();
									return CustomEditor.mark.toggleMark(editor, "italic");
								case "formatUnderline":
									event.preventDefault();
									return CustomEditor.mark.toggleMark(editor, "underlined");
							}
						}}
					/>
				</div>
			</Slate>
		</div>
	);
};

export default EditorComponent;
