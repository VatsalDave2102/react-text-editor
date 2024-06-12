import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
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

	const handleSizeChange = (event: SelectChangeEvent) => {
		const size = event.target.value;
		Transforms.setNodes(
			editor,
			{ fontSize: size },
			{ match: (n) => Text.isText(n), split: true }
		);
	};

	return (
		<FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
			<InputLabel id="font-size">Font Size</InputLabel>
			<Select onChange={handleSizeChange} label="size" labelId="font-size">
				{sizes.map((size) => (
					<MenuItem value={size} key={size}>
						{size}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default FontSizeButton;
