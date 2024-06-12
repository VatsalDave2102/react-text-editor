/* eslint-disable no-mixed-spaces-and-tabs */
import { ReactEditor } from "slate-react";
import { BaseEditor, Descendant, Range, BaseRange, Element } from "slate";

export type TextAlign =
	| "start"
	| "end"
	| "left"
	| "right"
	| "center"
	| "justify"
	| "match-parent";

export type ParagraphElement = {
	type: "paragraph";
	align?: TextAlign;
	children: Descendant[];
};

export type BlockQuoteElement = {
	type: "block-quote";
	align?: TextAlign;
	children: Descendant[];
};

export type BulledtedListElement = {
	type: "bulleted-list";
	align?: TextAlign;
	children: Descendant[];
};

export type NumberedListElement = {
	type: "numbered-list";
	align?: TextAlign;
	children: Descendant[];
};

export type CheckListItemElement = {
	type: "check-list-item";
	checked: boolean;
	children: Descendant[];
};

export type EditableVoidElement = {
	type: "editable-void";
	children: EmptyText[];
};

export type HeadingOneElement = {
	type: "heading-one";
	align?: TextAlign;
	children: Descendant[];
};

export type HeadingTwoElement = {
	type: "heading-two";
	align?: TextAlign;
	children: Descendant[];
};

export type ImageELement = {
	type: "image";
	url: string;
	alt: string;
	align: "left" | "right" | "center" | "justify";
	width: number;
	children: EmptyText[];
};

export type BadgeElement = {
	type: "badge";
	children: Descendant[];
	variant: "success" | "error" | "info";
};

export type ListItemElement = {
	type: "list-item";
	align?: TextAlign;
	children: Descendant[];
};

export type MentionElement = {
	type: "mention";
	character: string;
	children: CustomText[];
};

export type LinkELement = { type: "link"; url: string; children: Descendant[] };

export type VideoElement = {
	type: "video";
	url: string;
	children: EmptyText[];
};

export type AlignElement =
	| ParagraphElement
	| BlockQuoteElement
	| BulledtedListElement
	| NumberedListElement
	| HeadingOneElement
	| ImageELement
	| HeadingTwoElement
	| ListItemElement;

export type NonAlignElement =
	| CheckListItemElement
	| EditableVoidElement
	| LinkELement
	| BadgeElement
	| ListItemElement
	| MentionElement
	| VideoElement;

export type CustomElement = AlignElement | NonAlignElement;

export type ElementTypes =
	| "paragraph"
	| "block-quote"
	| "bulleted-list"
	| "numbered-list"
	| "check-list-item"
	| "editable-void"
	| "heading-one"
	| "heading-two"
	| "image"
	| "badge"
	| "list-item"
	| "mention"
	| "link"
	| "video";

export type CustomText = {
	text: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	code?: boolean;
	highlight?: boolean;
	fontFamily?: string;
	fontSize?: string;
	[key: string]: unknown;
};

export type EmptyText = {
	text: string;
};

declare module "slate" {
	interface CustomTypes {
		Editor: BaseEditor &
			ReactEditor & {
				nodeToDecorations?: Map<Element, Range[]>;
			};
		Element: CustomElement;
		Text: CustomText;
		Range: BaseRange & {
			[key: string]: unknown;
		};
	}
}
