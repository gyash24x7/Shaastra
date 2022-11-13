import type { Size } from "../utils/types";
import Flex from "../flex";
import { VariantSchema } from "../utils/variant";
import { createMemo, For, JSXElement } from "solid-js";

export interface HStackProps {
	spacing?: Size;
	className?: string;
	centered?: boolean;
	stackItemClassName?: string;
	children: JSXElement[];
	wrap?: boolean;
	stackItemExpand?: boolean;
}

const hStackFlexVS = new VariantSchema(
	"",
	{ spacing: { xs: "-mx-1", sm: "-mx-2", md: "-mx-3", lg: "-mx-4", xl: "-mx-5", "2xl": "-mx-6" } },
	{ spacing: "md" }
);

const hStackItemVs = new VariantSchema(
	"flex items-center",
	{
		spacing: { xs: "mx-1", sm: "mx-2", md: "mx-3", lg: "mx-4", xl: "mx-5", "2xl": "mx-6" },
		expand: { true: "flex-1", false: "" }
	},
	{ spacing: "md", expand: "false" }
);

export default function HStack( { children, ...props }: HStackProps ) {
	const flexClassname = createMemo( () => {
		return `${ hStackFlexVS.getClassname( { spacing: props.spacing } ) } ${ props.className }`;
	} );

	const stackItemClassname = createMemo( () => {
		const hStackItemClassname = hStackItemVs.getClassname( {
			expand: props.stackItemExpand ? "true" : "false",
			spacing: props.spacing
		} );
		return `${ hStackItemClassname } ${ props.stackItemClassName }`;
	} );

	return (
		<Flex
			justify = { props.centered ? "center" : "start" }
			align = { "center" }
			className = { flexClassname() }
			wrap = { props.wrap }
		>
			<div>
				<For each = { children }>
					{ ( child ) => <div class = { stackItemClassname() }>{ child }</div> }
				</For>
			</div>
		</Flex>
	);
};

