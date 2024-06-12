import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { Editor, Text, Transforms } from "slate";

const FontFamilyButton = ({ editor }: { editor: Editor }) => {
	const families = [
		"Arial",
		"Courier New",
		"Georgia",
		"Times New Roman",
		"Verdana",
	];
	const handleFontChange = (event: SelectChangeEvent) => {
		console.log(event.target.value);
		const family = event.target.value;
		Transforms.setNodes(
			editor,
			{ fontFamily: family },
			{ match: (n) => Text.isText(n), split: true }
		);
	};

	return (
		<FormControl size="small" sx={{ m: 1, minWidth: 140 }}>
			<InputLabel id="font-family">Font Family</InputLabel>

			<Select onChange={handleFontChange} label="font" labelId="font-family">
				{families.map((family) => (
					<MenuItem value={family} key={family}>
						{family}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default FontFamilyButton;
