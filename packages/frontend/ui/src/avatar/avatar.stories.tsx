import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "./avatar";

const meta: Meta<typeof Avatar> = {
	component: Avatar,
	title: "Avatar",
	argTypes: {
		size: {
			description: "Sets the size of the avatar",
			options: [ "xs", "sm", "md", "lg", "xl", "2xl" ],
			control: { type: "inline-radio" },
			defaultValue: "medium"
		},
		src: {
			description: "Sets the image to be shown as avatar"
		}
	}
};

export default meta;

export const Playground: StoryObj<typeof Avatar> = {
	render: ( props ) => <Avatar { ...props } />,
	args: { size: "md", name: "Yash Gupta" }
};
