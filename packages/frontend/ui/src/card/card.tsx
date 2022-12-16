import type { JSXElement } from "solid-js";
import { createMemo, Show } from "solid-js";
import { VariantSchema } from "../utils/variant";

export interface CardProps {
	title?: string;
	content: JSXElement;
	centered?: boolean;
}

const cardTitleVariantSchema = new VariantSchema(
	"text-xl mb-2 font-semibold",
	{ centered: { true: "text-center", false: "" } },
	{ centered: "false" }
);

export default function Card( { centered, title, content }: CardProps ) {
	const titleClass = createMemo( () => cardTitleVariantSchema.getClassname( {
		centered: centered ? "true" : "false"
	} ) );

	return (
		<div class = { "rounded-md p-4 flex-1 bg-light-100" }>
			<Show when = { !!title } keyed>
				<h2 class = { titleClass() }>{ title }</h2>
			</Show>
			{ content }
		</div>
	);
}