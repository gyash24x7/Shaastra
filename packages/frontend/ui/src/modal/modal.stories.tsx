import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./modal";

const meta: Meta<typeof Modal> = {
	component: Modal,
	title: "Modal",
	argTypes: {
		isOpen: {
			type: "boolean"
		}
	}
};

export default meta;

export const Playground: StoryObj<typeof Modal> = {
	render: ( props ) => <Modal { ...props } />,
	args: {
		title: "Modal Story",
		onClose: () => console.log( "Modal Closed!" ),
		isOpen: true,
		children: (
			<div>Hello from modal child</div>
		)
	}
};