import type { JSX } from "solid-js/jsx-runtime";
import Form, { FormProps } from "./form";

export default {
	name: "Form",
	component: Form
};

interface DemoFormData {
	name: string;
	email: string;
}

const Template: any = ( args: JSX.IntrinsicAttributes & FormProps<Object> ) => <Form { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { initialValue: { name: "", email: "" } } as FormProps<DemoFormData>;