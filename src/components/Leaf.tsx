import { RenderLeafProps } from "slate-react";

// component to return inline html elements
const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>;
	}

	if (leaf.code) {
		children = <code>{children}</code>;
	}

	if (leaf.italic) {
		children = <em>{children}</em>;
	}

	if (leaf.underline) {
		children = <u>{children}</u>;
	}
	return (
		// leaves must be inline that's why span tag is used
		<span {...attributes}>{children}</span>
	);
};

export default Leaf;
