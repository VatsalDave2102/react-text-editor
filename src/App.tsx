import { createEditor } from "slate";
import { useCallback, useState } from "react";
import { RenderElementProps, RenderLeafProps, withReact } from "slate-react";

import Leaf from "./components/Leaf";
import { useAppSelector } from "./store/hooks";
import EditorComponent from "./components/Editor";
import Element from "./components/DefaultElement";
import { withCustomFeatures } from "./lib/withCustomFeatures";
import NavigationSidebar from "./components/NavigationSidebar";

function App() {
	// get current editor from store
	const currentEditor = useAppSelector((state) => state.editors.currentEditor);

	// to make editor to be stable across renders, we use useState without a setter
	// for more reference
	const [editor] = useState(withCustomFeatures(withReact(createEditor())));

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

	return (
		<div className="h-full flex">
			<div className="flex h-screen w-60 flex-col inset-y-0">
				<div className="h-full text-primary w-full bg-white">
					<NavigationSidebar slateEditor={editor} />
				</div>
			</div>
			<main className="w-full">
				<div className="bg-sky-200 flex flex-col h-screen w-full">
					<div className="text-center mt-4">
						<h1 className="text-xl text-zinc-800 font-semibold">
							{currentEditor?.title}
						</h1>
					</div>
					<div className="bg-white mx-auto rounded-md my-10 w-4/5">
						{currentEditor && (
							<EditorComponent
								editor={editor}
								renderElement={renderElement}
								renderLeaf={renderLeaf}
							/>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

export default App;
