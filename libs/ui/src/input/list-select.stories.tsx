import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { ListSelect, ListSelectProps } from "./list-select";


const meta: ComponentMeta<typeof ListSelect> = { component: ListSelect, title: "ListSelect" };
export default meta;

const Template: ComponentStory<typeof ListSelect> = args => <ListSelect { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	options: [
		{ label: "Person 1", value: "AB" },
		{ label: "Person 2", value: "CD" },
		{ label: "Person 3", value: "EF" }
	],
	label: "Select User",
	message: "Helper Text",
	placeholder: "Select favourite user"
} as ListSelectProps;