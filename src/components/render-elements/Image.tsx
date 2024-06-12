import {
	RenderElementProps,
	useFocused,
	useSelected,
	useSlateStatic,
} from "slate-react";
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

	// getting currently selected state of an element
	const selected = useSelected();

	// getting the current focused state of editor
	const focused = useFocused();
	return (
		<div {...attributes}>
			{children}
			<div contentEditable={false} className="relative flex w-full">
				{element.type === "image" && (
					<>
						<img
							src={element.url}
							alt={element.alt}
							style={{ width: width + "px" }}
							className={`${
								element.align === "left"
									? "ml-0"
									: element.align === "right"
									? "ml-auto"
									: "mx-auto"
							} block ${selected && focused ? "shadow-xl" : "none"}`}
						/>
						<div
							onMouseDown={handleMouseDown}
							className="absolute right-0 bottom-0 w-2 h-2 bg-gray-300 cursor-nwse-resize"
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default Image;
