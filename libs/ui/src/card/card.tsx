import type { JSXElement } from "solid-js";
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
	return (
		<div class = { "rounded-md p-4 flex-1 bg-light-100" }>
			{ !!title && (
				<h2
					class = { cardTitleVariantSchema.getClassname( {
						centered: centered
							? "true"
							: "false"
					} ) }
				>
					{ title }
				</h2>
			) }
			{ content }
		</div>
	);
}