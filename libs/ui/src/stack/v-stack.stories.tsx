import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { VStack } from "./v-stack";


const meta: ComponentMeta<typeof VStack> = {
	component: VStack,
	title: "VStack",
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

const Template: ComponentStory<typeof VStack> = args => (
	<VStack { ...args }>
		<div style = { { background: "#dfe1e6", padding: 20 } }>Stack Child 1</div>
		<div style = { { background: "#c1c7d0", padding: 20 } }>Stack Child 2</div>
		<div style = { { background: "#808080", padding: 20 } }>Stack Child 3</div>
		<div style = { { background: "#808080", padding: 20 } }>Stack Child 4</div>
		<div style = { { background: "#808080", padding: 20 } }>Stack Child 5</div>
		<div style = { { background: "#808080", padding: 20 } }>Stack Child 6</div>
		<div style = { { background: "#808080", padding: 20 } }>Stack Child 7</div>
		<div style = { { background: "#808080", padding: 20 } }>Stack Child 8</div>
		<div style = { { background: "#808080", padding: 20 } }>Stack Child 9</div>
		<div style = { { background: "#808080", padding: 20 } }>Stack Child 10</div>
	</VStack>
);

export const Playground = Template.bind( {} );
Playground.args = {};