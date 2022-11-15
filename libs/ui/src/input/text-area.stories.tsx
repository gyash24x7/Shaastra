import TextArea, { TextAreaProps } from "./text-area";
import type { Appearance } from "../utils";

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


const Template: any = args => <TextArea { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	name: "message",
	label: "Message",
	placeholder: "Enter your message",
	message: "Write a beautiful message here..."
} as TextAreaProps;