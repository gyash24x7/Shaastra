import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { Modal, ModalProps } from "./modal";
import React from "react";

const meta: ComponentMeta<typeof Modal> = {
	component: Modal,
	title: "Modal",
	argTypes: {
		isOpen: {
			type: "boolean"
		}
	}
};

export default meta;

const Template: ComponentStory<typeof Modal> = args => <Modal { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	title: "Modal ComponentStory",
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