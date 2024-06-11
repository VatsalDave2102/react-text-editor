import { Editor, Text, Transforms } from "slate";

const FontFamilyButton = ({ editor }: { editor: Editor }) => {
	const families = [
		"Arial",
		"Courier New",
		"Georgia",
		"Times New Roman",
		"Verdana",
	];
	const handleFontChange: React.ChangeEventHandler<HTMLSelectElement> = (
		event
	) => {
		const family = event.target.value;
		Transforms.setNodes(
			editor,
			{ fontFamily: family },
			{ match: (n) => Text.isText(n), split: true }
		);
	};
	return (
		<select onChange={handleFontChange} defaultValue={""}>
			<option value="" disabled>
				Font Family
			</option>
			{families.map((family) => (
				<option value={family} key={family}>
					{family}
				</option>
			))}
		</select>
	);
};

export default FontFamilyButton;
