import type { JSX } from "solid-js/jsx-runtime";
import type { Appearance } from "../utils";
import TextArea, { TextAreaProps } from "./text-area";

export default {
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


const Template: any = ( args: JSX.IntrinsicAttributes & TextAreaProps ) => <TextArea { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	name: "message",
	label: "Message",
	placeholder: "Enter your message",
	message: "Write a beautiful message here..."
} as TextAreaProps;