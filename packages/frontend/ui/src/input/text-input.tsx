import { Fragment, useMemo } from "react";
import { When } from "react-if";
import { VariantSchema, RenderIcon } from "../utils";
import InputMessage from "./input-message";

export interface InputProps<V = any> {
	name: string | number | symbol;
	value?: V;
	setValue?: ( value: V ) => void;
}

export interface TextInputProps<T = any> extends InputProps<T> {
	label?: string;
	placeholder?: string;
	message?: string;
	type?: "text" | "number" | "email" | "password";
	renderIconBefore?: RenderIcon;
	renderIconAfter?: RenderIcon;
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

export default function TextInput( props: TextInputProps ) {
	const inputRootClassname = useMemo( () => inputRootVS.getClassname( {
		valid: props.appearance === "success" ? "true" : "false",
		invalid: props.appearance === "danger" ? "true" : "false"
	} ), [ props.appearance ] );

	return (
		<Fragment>
			<When condition={ !!props.label }>
				<label className={ "text-sm text-dark-100 font-semibold" } htmlFor={ props.name.toString() }>
					{ props.label }
				</label>
			</When>
			<div className={ inputRootClassname }>
				<When condition={ !!props.renderIconBefore }>
					{ props.renderIconBefore && props.renderIconBefore( { className: "w-4 h-4 mr-3 text-light-700" } ) }
				</When>
				<input
					style={ { all: "unset", flex: 1 } }
					type={ props.type || "text" }
					name={ props.name.toString() }
					placeholder={ props.placeholder }
					value={ props.value || "" }
					onInput={ e => props.setValue && props.setValue( e.currentTarget.value ) }
					autoComplete={ "" }
				/>
				<When condition={ !!props.renderIconAfter }>
					{ props.renderIconAfter && props.renderIconAfter( { className: "w-4 h-4 ml-3 text-light-700" } ) }
				</When>
			</div>
			<When condition={ !!props.message }>
				<InputMessage text={ props.message! } appearance={ props.appearance }/>
			</When>
		</Fragment>
	);
}