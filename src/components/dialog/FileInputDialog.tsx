import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useSlateStatic } from "slate-react";
import { ChangeEventHandler, useState } from "react";

import { CustomEditor } from "../../custom-editor/custom-editor";

// dialog to upload image file and set custom width
const FileDialog = ({
	onClose,
	open,
}: {
	onClose: () => void;
	open: boolean;
}) => {
	const [currentFile, setCurrentFile] = useState<File | null>(null);
	const [altText, setAltText] = useState("");
	const [width, setWidth] = useState(300);

	const editor = useSlateStatic();

	// handler to set current file
	const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		if (event.target.files) {
			const file = event.target.files[0];
			setCurrentFile(file);
		}
	};

	// handler to set width
	const handleWidthChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const newWidth = event.target.value;
		setWidth(Number(newWidth));
	};

	// handle to set alt text
	const handleAltTextChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const newAltText = event.target.value;
		setAltText(newAltText);
	};

	// function to add image in editor
	const addImage = () => {
		if (currentFile) {
			const reader = new FileReader();
			const [mime] = currentFile.type.split("/");

			if (mime === "image") {
				reader.addEventListener("load", () => {
					const url = reader.result;

					if (url) {
						CustomEditor.image.insertImage(
							editor,
							url as string,
							altText,
							width
						);
					}
				});
				reader.readAsDataURL(currentFile);
			}
			onClose();
		}
	};

	return (
		<Dialog
			onClose={onClose}
			open={open}
			fullWidth={true}
			aria-labelledby="image-dialog-title"
		>
			<DialogTitle>Pick image from device</DialogTitle>
			<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
				{/* file input */}
				<input type="file" onChange={handleFileChange} />

				{/* width input */}
				<div className="flex flex-col">
					<label htmlFor="width">Set width</label>
					<input
						autoFocus
						type="number"
						onChange={handleWidthChange}
						className="ring-1"
						value={width}
						id="width"
					/>
				</div>

				{/* alt text input */}
				<div className="flex flex-col">
					<label htmlFor="alt">Set Alt text</label>
					<input
						autoFocus
						type="string"
						onChange={handleAltTextChange}
						className="ring-1"
						value={altText}
						id="alt"
					/>
				</div>
			</DialogContent>
			{currentFile && (
				<DialogActions>
					<Button onClick={addImage}>Add image</Button>
				</DialogActions>
			)}
		</Dialog>
	);
};

export default FileDialog;
