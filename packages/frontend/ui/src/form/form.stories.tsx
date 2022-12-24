import type { StoryFn } from "@storybook/html";
import { envelope, user } from "solid-heroicons/solid";
import Button from "../button";
import { TextInput } from "../input";
import Form, { FormProps } from "./form";

export default {
	title: "Form",
	component: Form
};

interface DemoFormData {
	name: string;
	email: string;
}

const Template: StoryFn<FormProps<DemoFormData>> = args => <Form { ...args } /> as any;

export const Playground = Template.bind( {} );
Playground.args = {
	initialValue: { name: "", email: "" },
	submitBtn: () => <Button buttonText = { "Submit" }/>,
	renderMap: {
		name( props ) {
			return (
				<TextInput
					{ ...props }
					label = { "Name" }
					placeholder = { "Enter your Name" }
					iconAfter = { user }
				/>
			);
		},
		email( props ) {
			return (
				<TextInput
					{ ...props }
					type = { "email" }
					label = { "Email" }
					placeholder = { "Enter you Email" }
					iconAfter = { envelope }
				/>
			);
		}
	}
} as FormProps<DemoFormData>;