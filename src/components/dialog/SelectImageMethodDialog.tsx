import { useState } from "react";
import { useSlateStatic } from "slate-react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

import FileDialog from "./FileInputDialog";
import { CustomEditor } from "../../custom-editor/custom-editor";

// dialog to select method to upload image
const SelectImageMethodDialog = ({
	onClose,
	open,
}: {
	onClose: () => void;
	open: boolean;
}) => {
	const [fileOpen, setFileOpen] = useState(false);

	const handleClickFileOpen = () => {
		setFileOpen(true);
	};

	const handleFileClose = () => {
		setFileOpen(false);
		onClose();
	};

	const editor = useSlateStatic();

	return (
		<Dialog
			onClose={onClose}
			open={open}
			fullWidth={true}
			aria-labelledby="image-dialog-title"
		>
			<DialogTitle id="image-dialog-title">Select input method</DialogTitle>
			<DialogActions>
				{/* url button */}
				<Button
					onMouseDown={(event) => {
						event.preventDefault();

						// prompt for image url
						const url = window.prompt("Enter url of the image:");

						// if not valid image url, alert error
						if (url && !CustomEditor.image.isImageUrl(url)) {
							alert("URL is not an image");
							return;
						}

						// insert image in editor
						url && CustomEditor.image.insertImage(editor, url, "URL image");
						onClose();
					}}
				>
					URL
				</Button>

				{/* file picker button */}
				<Button onClick={handleClickFileOpen}>From device</Button>
				<FileDialog onClose={handleFileClose} open={fileOpen} />
			</DialogActions>
		</Dialog>
	);
};

export default SelectImageMethodDialog;
