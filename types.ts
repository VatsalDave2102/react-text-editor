import { Descendant, Path } from "slate";

export interface BaseProps {
	className: string;
	[key: string]: unknown;
}

export interface EditorInstance {
	id: string;
	title: string;
	value: Descendant[];
}

export type Range = {
	anchor: {
		path: Path;
		offset: number;
	};
	focus: { path: Path; offset: number };
	highlight: boolean;
};

export type Ranges = Range[];
export type SpecialButtons =
	| "add-link"
	| "remove-link"
	| "embed-video"
	| "badge"
	| "image"
	| "search-input";

export type FontButtons = "font-size" | "font-family";

export type MarkButtons = "bold" | "italic" | "underline" | "code";
export type BlockButtons =
	| "heading-one"
	| "heading-two"
	| "block-quote"
	| "bulleted-list"
	| "numbered-list"
	| "check-list-item"
	| "left"
	| "center"
	| "right"
	| "justify";
