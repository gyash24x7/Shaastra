import { createSignal } from "solid-js";
import Avatar from "../avatar/avatar";
import SingleSelect, { SingleSelectProps } from "./single-select";

export default { component: SingleSelect, title: "Single Select" };


const SingleSelectStateful = ( props: { options: string[], renderOption: SingleSelectProps<string>["renderOption"] } ) => {
	const [ value, setValue ] = createSignal( props.options[ 0 ] );
	return <SingleSelect { ...props } value = { value } onChange = { setValue } />;
};

const Template: any = ( args: SingleSelectProps<string> ) => <SingleSelectStateful { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	options: [ "Option A", "Option B", "Option C" ],
	renderOption: ( option, _checked ) => <Avatar name = { option } />
} as SingleSelectProps<string>;
