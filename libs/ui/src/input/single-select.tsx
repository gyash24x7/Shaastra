import { RadioGroup, RadioGroupOption } from "solid-headless";
import { Accessor, For, JSXElement, Setter } from "solid-js";
import HStack from "../stack/h-stack";
import { VariantSchema } from "../utils/variant";

export interface SingleSelectProps<T> {
	value: Accessor<T>;
	onChange: Setter<T>;
	options: Array<T>;
	renderOption: ( option: T, checked: boolean ) => JSXElement;
}

const radioSelectOptionVS = new VariantSchema(
	"hover:bg-light-300 outline-none cursor-pointer my-2 p-2 rounded-md",
	{ checked: { true: "bg-primary-100 hover:bg-primary-100", false: "" } },
	{ checked: "false" }
);

const radioSelectOptionClassname = ( checked: boolean ) => {
	return radioSelectOptionVS.getClassname( { checked: checked ? "true" : "false" } );
};

export default function SingleSelect<T>( props: SingleSelectProps<T> ) {
	return (
		<RadioGroup<T> value = { props.value() } onChange = { props.onChange }>
			{ ( { isSelected } ) => (
				<HStack wrap spacing = { "xs" }>
					<For each = { props.options }>
						{ ( option ) => (
							<RadioGroupOption
								value = { option }
								class = { radioSelectOptionClassname( isSelected( option ) ) }
							>
								{ props.renderOption( option, isSelected( option ) ) }
							</RadioGroupOption>
						) }
					</For>
				</HStack>
			) }
		</RadioGroup>
	);
}