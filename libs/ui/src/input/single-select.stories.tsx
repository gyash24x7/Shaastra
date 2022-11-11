import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { SingleSelect, SingleSelectProps } from "./single-select";
import { Avatar } from "../avatar/avatar";
import React, { useState } from "react";

const meta: ComponentMeta<typeof SingleSelect<string>> = { component: SingleSelect, title: "Single Select" };
export default meta;

const SingleSelectStateful = ( props: { options: string[], renderOption: SingleSelectProps<string>["renderOption"] } ) => {
	const [ value, setValue ] = useState( props.options[ 0 ] );
	return <SingleSelect { ...props } value = { value } onChange = { setValue } />;
};

const Template: ComponentStory<typeof SingleSelect<string>> = ( args ) => {
	return <SingleSelectStateful { ...args } />;
};

export const Playground = Template.bind( {} );
Playground.args = {
	options: [ "Option A", "Option B", "Option C" ],
	renderOption: ( option, _checked ) => <Avatar name = { option } />
} as SingleSelectProps<string>;
