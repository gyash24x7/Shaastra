import type { ComponentMeta, ComponentStory } from "@storybook/react";
import Avatar, { AvatarProps } from "./avatar";

const meta: ComponentMeta<typeof Avatar> = {
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

const Template: ComponentStory<typeof Avatar> = ( args: any ) => <Avatar { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { size: "md", name: "Yash Gupta" } as AvatarProps;
