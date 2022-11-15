import Modal, { ModalProps } from "./modal";
import type { JSX } from "solid-js/jsx-runtime";

export default {
	component: Modal,
	title: "Modal",
	argTypes: {
		isOpen: {
			type: "boolean"
		}
	}
};

const Template: any = ( args: JSX.IntrinsicAttributes & ModalProps ) => <Modal { ...args } />;

export const Playground = Template.bind( {} );

Playground.args = {
	title: "Modal Story",
	onClose: () => console.log( "Modal Closed!" ),
	isOpen: true,
	children: (
		<div>Hello from modal child</div>
	),
	actions: [
		{ appearance: "primary", buttonText: "Action Button" },
		{ buttonText: "Cancel", appearance: "default" }
	]
} as ModalProps;