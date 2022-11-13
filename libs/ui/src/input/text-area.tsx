import { InputMessage } from "./input-message";
import { VariantSchema } from "../utils/variant";
import { createMemo, Show } from "solid-js";

export interface TextAreaProps {
	label?: string;
	name: string;
	placeholder?: string;
	message?: string;
	rows?: number;
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

export function TextArea( props: TextAreaProps ) {
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
				<textarea
					name = { props.name }
					rows = { props.rows || 3 }
					placeholder = { props.placeholder || "" }
					value = { props.value }
					onInput = { e => props.onChange && props.onChange( e.currentTarget.value ) }
				/>
			</div>
			{ props.message && <InputMessage text = { props.message } appearance = { props.appearance } /> }
		</>
	);
}