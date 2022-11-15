import ListSelect, { ListSelectProps } from "./list-select";

export default { component: ListSelect, title: "ListSelect" };

const Template: any = ( args: ListSelectProps<string> ) => <ListSelect { ...args } />;

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
} as ListSelectProps<string>;