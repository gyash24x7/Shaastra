import type { ComponentMeta, ComponentStory } from "@storybook/react";
import HStack from "./h-stack";


const meta: ComponentMeta<typeof HStack> = {
	component: HStack,
	title: "HStack",
	argTypes: {
		spacing: {
			options: [ "xs", "sm", "md", "lg", "xl", "2xl" ],
			control: { type: "inline-radio" },
			description: "Sets the spacing between the stack elements",
			defaultValue: "sm"
		},
		centered: {
			description: "Moves the stack to the center of parent",
			defaultValue: false,
			control: { type: "boolean" }
		}
	}
};

export default meta;

const Template: ComponentStory<typeof HStack> = args => (
	<HStack { ...args }>
		<div class = { "bg-blue-300 p-4" }>Stack Child 1</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 2</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 3</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 4</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 5</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 6</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 7</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 8</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 9</div>
		<div class = { "bg-blue-300 p-4" }>Stack Child 10</div>
	</HStack>
);

export const Playground = Template.bind( {} );
Playground.args = {};