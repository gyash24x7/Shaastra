import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { TextInput, TextInputProps } from "./text-input";
import type { Appearance } from "../utils";
import { envelope, lockClosed } from "solid-heroicons/solid";


const meta: ComponentMeta<typeof TextInput> = {
	component: TextInput,
	title: "TextInput",
	argTypes: {
		appearance: {
			options: [ "default", "danger", "success" ] as Appearance[],
			control: { type: "inline-radio" },
			defaultValue: "neutral",
			description: "Sets the appearance of the Input"
		}
	}
};
export default meta;

const Template: ComponentStory<typeof TextInput> = args => <TextInput { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	name: "firstName",
	message: "Helper Text",
	label: "Name",
	placeholder: "Enter your Name",
	appearance: "default"
} as TextInputProps;

export const TextInputWithIconBefore = Template.bind( {} );
TextInputWithIconBefore.args = {
	name: "email",
	label: "Email",
	type: "email",
	placeholder: "Enter your Email",
	appearance: "default",
	iconBefore: envelope
} as TextInputProps;

export const TextInputWithIconAfter = Template.bind( {} );
TextInputWithIconAfter.args = {
	name: "password",
	label: "Password",
	type: "password",
	placeholder: "Enter your Password",
	appearance: "default",
	iconAfter: lockClosed
} as TextInputProps;
