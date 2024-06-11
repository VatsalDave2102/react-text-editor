import {
	ReactEditor,
	RenderElementProps,
	useFocused,
	useSelected,
	useSlateStatic,
} from "slate-react";
import { Button } from "../common/Button";
import { Icon } from "../common/Icon";
import { Transforms } from "slate";
import { useState } from "react";
import { ImageELement } from "../../types";

const Image: React.FC<RenderElementProps> = ({
	attributes,
	children,
	element,
}) => {
	const [width, setWidth] = useState((element as ImageELement).width || 200);
	const editor = useSlateStatic();

	const handleMouseDown: React.MouseEventHandler<HTMLImageElement> = (
		event
	) => {
		console.log("activated");
		event.preventDefault();
		const startX = event.clientX;
		const startWidth = width;

		const onMouseMove = (moveEvent: MouseEvent) => {
			const newWidth = startWidth + moveEvent.clientX - startX;
			setWidth(newWidth);
			console.log(newWidth);
			Transforms.setNodes(
				editor,
				{ width: newWidth },
				{ match: (n) => n === element }
			);
		};

		const onMouseUp = () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
	};

	// getting path of the node in the editor
	const path = ReactEditor.findPath(editor, element);

	// getting currently selected state of an element
	const selected = useSelected();

	// getting the current focused state of editor
	const focused = useFocused();
	return (
		<div {...attributes}>
			{children}
			<div contentEditable={false} className="relative inline-block">
				{element.type === "image" && (
					<>
						<img
							src={element.url}
							style={{ width: width + "px" }}
							className={`block ${selected && focused ? "shadow-xl" : "none"} ${
								element.align === "left" ? "ml-0" : "mx-auto"
							}`}
						/>
						<div
							onMouseDown={handleMouseDown}
							className="absolute right-0 bottom-0 w-2 h-2 bg-gray-300 cursor-nwse-resize"
						/>
					</>
				)}
				{/* button to delete the image */}
				<Button
					active
					onClick={() =>
						Transforms.removeNodes(editor, {
							at: path,
						})
					}
					className={`absolute top-2 left-2`}
				>
					<Icon>delete</Icon>
				</Button>
			</div>
		</div>
	);
};

export default Image;
