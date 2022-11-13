import { VariantSchema } from "../utils/variant";
import { HStack } from "../stack/h-stack";
import { checkCircle, exclamationCircle } from "solid-heroicons/solid";
import { Icon } from "solid-heroicons";
import { createMemo, Show } from "solid-js";

export interface InputMessageProps {
	appearance?: "default" | "danger" | "success";
	text: string;
}

const inputMessageVS = new VariantSchema(
	"text-sm text-dark-100 mt-1",
	{
		valid: { true: "text-success", false: "" },
		invalid: { true: "text-danger", false: "" }
	},
	{ valid: "false", invalid: "false" }
);

export function InputMessage( { appearance, text }: InputMessageProps ) {
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
			<HStack spacing = { "xs" }>
				<Show when = { !!icon() } keyed>
					<Icon class = { "w-3 h-3" } path = { icon()! } />
				</Show>
				<>{ text }</>
			</HStack>
		</div>
	);
}