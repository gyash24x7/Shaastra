import Spinner, { SpinnerProps } from "./spinner";
import type { Appearance, Size } from "../utils";
import type { JSX } from "solid-js/jsx-runtime";


export default {
	component: Spinner,
	title: "Spinner",
	argTypes: {
		appearance: {
			options: [ "primary", "default", "danger", "info", "alt", "warning", "success" ] as Appearance[],
			control: { type: "inline-radio" },
			defaultValue: "default",
			description: "Sets the appearance of the spinner"
		},
		size: {
			options: [ "xs", "sm", "md", "lg", "xl", "2xl" ] as Size[],
			control: { type: "inline-radio" },
			description: "Sets the size of the spinner",
			defaultValue: "medium"
		}
	}
};


const Template: any = ( args: JSX.IntrinsicAttributes & SpinnerProps ) => <Spinner { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { size: "md" };