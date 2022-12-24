import { Icon } from "solid-heroicons";
import { Accessor, createMemo, Show } from "solid-js";
import type { IconType } from "../utils";
import { VariantSchema } from "../utils";
import InputMessage from "./input-message";

export interface InputProps<V = any> {
	name: string | number | symbol;
	value?: Accessor<V>;
	setValue?: ( value: V ) => void;
}

export interface TextInputProps<T = any> extends InputProps<T> {
	label?: string;
	placeholder?: string;
	message?: string;
	type?: "text" | "number" | "email" | "password";
	iconBefore?: IconType;
	iconAfter?: IconType;
	appearance?: "default" | "danger" | "success";
}

const inputRootVS = new VariantSchema(
	"flex items-center border-2 rounded-md border-light-700 text-dark w-full p-2 text-base",
	{
		valid: { true: "border-success", false: "" },
		invalid: { true: "border-danger", false: "" }
	},
	{ valid: "false", invalid: "false" }
);

export default function TextInput( props: TextInputProps ) {
	const inputRootClassname = createMemo( () => inputRootVS.getClassname( {
		valid: props.appearance === "success" ? "true" : "false",
		invalid: props.appearance === "danger" ? "true" : "false"
	} ) );

	return (
		<>
			<Show when = { !!props.label } keyed>
				<label class = { "text-sm text-dark-100 font-semibold" } for = { props.name.toString() }>
					{ props.label }
				</label>
			</Show>
			<div class = { inputRootClassname() }>
				<Show when = { !!props.iconBefore } keyed>
					<Icon class = { "w-4 h-4 mr-3 text-light-700" } path = { props.iconBefore! }/>
				</Show>
				<input
					style = { { all: "unset", flex: 1 } }
					type = { props.type || "text" }
					name = { props.name.toString() }
					placeholder = { props.placeholder }
					value = { props.value ? props.value() : "" }
					onInput = { e => props.setValue && props.setValue( e.currentTarget.value ) }
					autocomplete = { "" }
				/>
				<Show when = { !!props.iconAfter } keyed>
					<Icon class = { "w-4 h-4 ml-3 text-light-700" } path = { props.iconAfter! }/>
				</Show>
			</div>
			<Show keyed when = { !!props.message }>
				<InputMessage text = { props.message! } appearance = { props.appearance }/>
			</Show>
		</>
	);
}