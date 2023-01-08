import type { Meta, StoryObj } from "@storybook/react";
import type { Appearance } from "../utils";
import TextArea from "./text-area";

const meta: Meta<typeof TextArea> = {
	component: TextArea,
	title: "TextArea",
	argTypes: {
		appearance: {
			options: [ "neutral", "danger", "success" ] as Appearance[],
			control: { type: "inline-radio" },
			defaultValue: "neutral",
			description: "Sets the appearance of the TextArea"
		}
	}
};

export default meta;

export const Playground: StoryObj<typeof TextArea> = {
	render: ( props ) => <TextArea { ...props } />,
	args: {
		name: "message",
		label: "Message",
		placeholder: "Enter your message",
		message: "Write a beautiful message here..."
	}
};