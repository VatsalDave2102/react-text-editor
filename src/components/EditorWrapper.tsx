import { Descendant, createEditor } from "slate";
import { useMemo } from "react";
import { withReact } from "slate-react";

import Title from "../components/Title";
import EditorComponent from "../components/Editor";
import { withCustomFeatures } from "../lib/withCustomFeatures";
import NavigationSidebar from "../components/NavigationSidebar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { storeContent } from "../store/editorSlice";

const EditorWrapper = () => {
	// to make editor to be stable across renders, we use useMemo hook and create an editor
	// which is wrapped by reactEditor to work it with react
	// and again wrapped by our withCustomFeatures plugin to provide additional features
	const editor = useMemo(
		() => withCustomFeatures(withReact(createEditor())),
		[]
	);

	const dispatch = useAppDispatch();

	// getting current editor from store
	const currentEditor = useAppSelector((state) => state.editors.currentEditor);

	return (
		<div className="h-full flex">
			<div className="flex h-screen w-60 flex-col">
				<div className="h-full text-primary w-full bg-white">
					<NavigationSidebar slateEditor={editor} />
				</div>
			</div>
			<main className="w-full">
				<div className="bg-sky-200 flex flex-col h-screen w-full">
					<Title />
					{currentEditor ? (
						<EditorComponent
							editor={editor}
							editorKey={currentEditor.id}
							initialValue={currentEditor.value}
							markButtons={["bold", "italic", "underline", "code"]}
							blockButtons={[
								"heading-one",
								"heading-two",
								"block-quote",
								"bulleted-list",
								"numbered-list",
								"check-list-item",
								"left",
								"center",
								"right",
								"justify",
							]}
							specialButtons={[
								"add-link",
								"remove-link",
								"embed-video",
								"badge",
								"image",
								"search-input",
							]}
							fontButtons={["font-family", "font-size"]}
							onChange={function (value: Descendant[]) {
								dispatch(
									storeContent({
										id: currentEditor.id,
										value,
										editor,
									})
								);
							}}
						/>
					) : (
						<div>
							<h2 className="text-center py-2 text-xl font-semibold">
								No editors, add one using the sidebar
							</h2>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default EditorWrapper;
