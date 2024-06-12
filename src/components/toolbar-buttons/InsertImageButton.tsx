import { useState } from "react";

import { Icon } from "../common/Icon";
import Tooltip from "../common/Tooltip";
import { Button } from "../common/Button";
import SelectImageMethodDialog from "../dialog/SelectImageMethodDialog";

// button to insert images
const InsertImageButton = () => {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Tooltip message="insert-image">
			<Button onClick={handleClickOpen}>
				<Icon>image</Icon>
			</Button>
			<SelectImageMethodDialog onClose={handleClose} open={open} />
		</Tooltip>
	);
};

export default InsertImageButton;
