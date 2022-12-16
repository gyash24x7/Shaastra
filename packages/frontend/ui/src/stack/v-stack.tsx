import type { JSXElement } from "solid-js";
import { createMemo, For } from "solid-js";
import type { Size } from "../utils/types";
import { VariantSchema } from "../utils/variant";

export interface VStackProps {
	spacing?: Size;
	className?: string;
	centered?: boolean;
	stackItemClassName?: string;
	children: JSXElement[] | JSXElement;
}

const vStackItemVS = new VariantSchema(
	"last-of-type:mb-0",
	{
		spacing: { xs: "mb-1", sm: "mb-2", md: "mb-3", lg: "mb-4", xl: "mb-5", "2xl": "mb-6" },
		centered: { true: "flex justify-center", false: "" }
	},
	{ spacing: "md", centered: "false" }
);

export default function VStack( { children, ...props }: VStackProps ) {
	const stackItemClassname = createMemo( () => {
		const vStackItemClassname = vStackItemVS.getClassname( {
			centered: props.centered ? "true" : "false",
			spacing: props.spacing
		} );

		return `${ vStackItemClassname } ${ props.stackItemClassName }`;
	} );

	return (
		<div class = { props.className }>
			<For each = { Array.isArray( children ) ? children : [ children ] }>
				{ child => <div class = { stackItemClassname() }>{ child }</div> }
			</For>
		</div>
	);
};