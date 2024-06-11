import {
	Editable,
	RenderElementProps,
	RenderLeafProps,
	Slate,
} from "slate-react";
import { Editor } from "slate";

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
import Toolbar from "./Toolbar";
import HoveringToolbar from "./HoveringToolbar";
import { useDecorate } from "../hooks/useDecorate";
import { storeContent } from "../store/editorSlice";
import { CustomEditor } from "../custom-editor/custom-editor";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import FontSizeButton from "./toolbar-buttons/FontSizeButton";
import FontFamilyButton from "./toolbar-buttons/FontFamilyButton";

interface EditorProps {
	editor: Editor;
	renderElement: (props: RenderElementProps) => JSX.Element;
	renderLeaf: (props: RenderLeafProps) => JSX.Element;
}

const EditorComponent: React.FC<EditorProps> = ({
	editor,
	renderElement,
	renderLeaf,
}) => {
	const dispatch = useAppDispatch();

	// custom hook to highlight searched text
	const { setSearch, decorate } = useDecorate();

	// getting current editor from store
	const currentEditor = useAppSelector((state) => state.editors.currentEditor);

	if (!currentEditor) {
		return (
			<div>
				<h2 className="text-center py-2 text-xl font-semibold">
					No editors, add one using the sidebar
				</h2>
			</div>
		);
	}

	return (
		// render the slate context, must be rendered above any editable components,
		//  it can provide editor state to other components like toolbars, menus
		<Slate
			editor={editor}
			key={currentEditor.id}
			initialValue={currentEditor.value}
			// dispatch action to store value in localStorage on change
			onChange={(value) =>
				dispatch(
					storeContent({
						id: currentEditor.id,
						value,
						editor,
					})
				)
			}
		>
			{/* Toolbar */}
			<Toolbar>
				{/* Mark buttons */}
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<MarkButton format="bold" icon="format_bold" />
					<MarkButton format="italic" icon="format_italic" />
					<MarkButton format="underline" icon="format_underlined" />
					<MarkButton format="code" icon="code" />
				</div>
				{/* Block buttons */}
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<BlockButton format="heading-one" icon="looks_one" />
					<BlockButton format="heading-two" icon="looks_two" />
					<BlockButton format="block-quote" icon="format_quote" />
				</div>
				{/* List buttons */}
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<BlockButton format="bulleted-list" icon="format_list_bulleted" />
					<BlockButton format="numbered-list" icon="format_list_numbered" />
					<BlockButton format="check-list-item" icon="check_box" />
				</div>
				{/* Alignment buttons */}
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<BlockButton format="left" icon="format_align_left" />
					<BlockButton format="center" icon="format_align_center" />
					<BlockButton format="right" icon="format_align_right" />
					<BlockButton format="justify" icon="format_align_justify" />
				</div>
				{/* Link, embed buttons */}
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<AddLinkButton />
					<RemoveLinkButton />
					<EmbedVideoButton />
				</div>
				{/* Inline button, badge, Image buttons */}
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<InsertBadgeButton />
					<InsertImageButton />
				</div>
				{/* Search input */}
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<SearchInput setSearch={setSearch} />
				</div>
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<FontFamilyButton editor={editor} />
				</div>
				<div className="flex flex-row gap-x-3 border-r pr-2">
					<FontSizeButton editor={editor} />
				</div>
			</Toolbar>
			<HoveringToolbar />
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
	);
};

export default EditorComponent;
