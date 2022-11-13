import type { IconType } from "../utils/types";
import { InputMessage } from "./input-message";
import { VariantSchema } from "../utils/variant";
import { createMemo, Show } from "solid-js";
import { Icon } from "solid-heroicons";

export interface TextInputProps {
	label?: string;
	name: string;
	placeholder?: string;
	message?: string;
	type?: "text" | "number" | "email" | "password";
	iconBefore?: IconType;
	iconAfter?: IconType;
	value?: string;
	onChange?: ( value: string ) => void | Promise<void>;
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

export function TextInput( props: TextInputProps ) {
	const inputRootClassname = createMemo( () => inputRootVS.getClassname( {
		valid: props.appearance === "success" ? "true" : "false",
		invalid: props.appearance === "danger" ? "true" : "false"
	} ) );

	return (
		<>
			<Show when = { !!props.label } keyed>
				<label class = { "text-sm text-dark-100 font-semibold" } for = { props.name }>
					{ props.label }
				</label>
			</Show>
			<div class = { inputRootClassname() }>
				<Show when = { !!props.iconBefore } keyed>
					<Icon class = { "w-4 h-4 mr-3 text-light-700" } path = { props.iconBefore! } />
				</Show>
				<input
					style = { { all: "unset", flex: 1 } }
					type = { props.type || "text" }
					name = { props.name }
					placeholder = { props.placeholder }
					value = { props.value }
					onInput = { e => props.onChange && props.onChange( e.currentTarget.value ) }
				/>
				<Show when = { !!props.iconAfter } keyed>
					<Icon class = { "w-4 h-4 ml-3 text-light-700" } path = { props.iconAfter! } />
				</Show>
			</div>
			<Show keyed when = { !!props.message }>
				<InputMessage text = { props.message! } appearance = { props.appearance } />
			</Show>
		</>
	);
}