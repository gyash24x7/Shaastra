import { useMemo, ReactNode } from "react";
import type { Size } from "../utils/types";
import { VariantSchema } from "../utils/variant";

export interface VStackProps {
	spacing?: Size;
	className?: string;
	centered?: boolean;
	stackItemClassName?: string;
	children: ReactNode;
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
	const stackItemClassname = useMemo( () => {
		const vStackItemClassname = vStackItemVS.getClassname( {
			centered: props.centered ? "true" : "false",
			spacing: props.spacing
		} );

		return `${ vStackItemClassname } ${ props.stackItemClassName }`;
	}, [ props.stackItemClassName, props.spacing, props.centered ] );

	const stackItems = Array.isArray( children ) ? children : [ children ];

	return (
		<div className={ props.className }>
			{ stackItems.map( child => <div className={ stackItemClassname }>{ child }</div> ) }
		</div>
	);
};