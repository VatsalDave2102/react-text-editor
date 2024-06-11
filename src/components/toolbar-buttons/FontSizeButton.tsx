import { Editor, Text, Transforms } from "slate";

const FontSizeButton = ({ editor }: { editor: Editor }) => {
	const sizes = [
		"10px",
		"12px",
		"14px",
		"16px",
		"18px",
		"24px",
		"32px",
		"48px",
	];

	const handleSizeChange: React.ChangeEventHandler<HTMLSelectElement> = (
		event
	) => {
		const size = event.target.value;
		Transforms.setNodes(
			editor,
			{ fontSize: size },
			{ match: (n) => Text.isText(n), split: true }
		);
	};
	return (
		<select onChange={handleSizeChange} defaultValue={""}>
			<option value="" disabled>
				Font Size
			</option>
			{sizes.map((size) => (
				<option value={size} key={size}>
					{size}
				</option>
			))}
		</select>
	);
};

export default FontSizeButton;
