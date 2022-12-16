import type { JSX } from "solid-js/jsx-runtime";
import Avatar, { AvatarProps } from "./avatar";

export default {
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

const Template: any = ( args: JSX.IntrinsicAttributes & AvatarProps ) => <Avatar { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { size: "md", name: "Yash Gupta" } as AvatarProps;
