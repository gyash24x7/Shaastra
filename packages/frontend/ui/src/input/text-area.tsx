import { createMemo, Show } from "solid-js";
import { VariantSchema } from "../utils";
import InputMessage from "./input-message";
import type { InputProps } from "./text-input";

export interface TextAreaProps extends InputProps {
	label?: string;
	placeholder?: string;
	message?: string;
	rows?: number;
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

export default function TextArea( props: TextAreaProps ) {
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
				<textarea
					name = { props.name.toString() }
					rows = { props.rows || 3 }
					placeholder = { props.placeholder || "" }
					value = { props.value ? props.value() : "" }
					onInput = { e => props.setValue && props.setValue( e.currentTarget.value ) }
					style = { { all: "unset", width: "100%" } }
				/>
			</div>
			<Show keyed when = { !!props.message }>
				<InputMessage text = { props.message! } appearance = { props.appearance }/>
			</Show>
		</>
	);
}