import { Icon } from "solid-heroicons";
import { checkCircle, exclamationCircle } from "solid-heroicons/solid";
import { createMemo, Show } from "solid-js";
import { VariantSchema } from "../utils/variant";

export interface InputMessageProps {
	appearance?: "default" | "danger" | "success";
	text: string;
}

const inputMessageVS = new VariantSchema(
	"text-sm text-dark-100 mt-1 flex items-center",
	{
		valid: { true: "text-success", false: "" },
		invalid: { true: "text-danger", false: "" }
	},
	{ valid: "false", invalid: "false" }
);

export default function InputMessage( { appearance, text }: InputMessageProps ) {
	const icon = createMemo( () => {
		switch ( appearance ) {
			case "success":
				return checkCircle;
			case "danger":
				return exclamationCircle;
			default:
				return undefined;
		}
	} );

	const inputMsgClassname = createMemo( () => inputMessageVS.getClassname( {
		valid: appearance === "success" ? "true" : "false",
		invalid: appearance === "danger" ? "true" : "false"
	} ) );

	return (
		<div class = { inputMsgClassname() }>
			<Show when = { !!icon() } keyed>
				<span class = { "inline-block mr-1" }>
					<Icon class = { "w-3 h-3" } path = { icon()! }/>
				</span>
			</Show>
			<span>{ text }</span>
		</div>
	);
}