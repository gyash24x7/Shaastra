import type { Accessor, JSXElement } from "solid-js";
import { createSignal, For } from "solid-js";
import type { FieldOf, FieldRenderFn, FieldValueOf } from "./field";
import Field from "./field";
import { VStack } from "../stack";
import { createStore } from "solid-js/store";

type FieldData<P, V = any> = Map<FieldOf<P>, V>;

type Fields<T> = Array<FieldOf<T>>;

export type CreateFormOptions<T> = {
	initialValue: T;
	onSubmit?: ( values: T ) => void | Promise<void>
}

export function createForm<T extends Object>( options: CreateFormOptions<T> ) {
	const [ fields ] = createSignal<Fields<T>>(
		Object.keys( options.initialValue ) as Fields<T>
	);
	const [ values, setValues ] = createStore( options.initialValue );

	const [ errors, setErrors ] = createSignal<FieldData<T, Array<string>>>( new Map() );

	const getFieldValue = ( name: FieldOf<T> ): Accessor<FieldValueOf<T, typeof name>> => () => values[ name ];

	const setFieldValue = ( name: FieldOf<T> ) => {
		return ( value: FieldValueOf<T, typeof name> ) => setValues( values => (
			{ ...values, [ name ]: value }
		) );
	};

	const setFieldErrors = ( name: FieldOf<T>, error: string ) => {
		setErrors( errors => (
			{ ...errors, [ name ]: error }
		) );
	};

	const onSubmit = ( e: Event ) => {
		e.preventDefault();
		if ( options.onSubmit ) {
			options.onSubmit( values );
		}
	};

	return { values, setFieldValue, errors, setFieldErrors, fields, onSubmit, getFieldValue };
}

export interface FormProps<T> {
	initialValue: T;
	onSubmit?: ( values: T ) => void | Promise<void>;
	submitBtn: () => JSXElement;
	renderMap: Record<FieldOf<T>, FieldRenderFn<T, FieldOf<T>>>;
}

export default function Form<T extends Object>( props: FormProps<T> ) {
	const { onSubmit, getFieldValue, setFieldValue, fields } = createForm<T>( props );
	const SubmitButton = props.submitBtn;

	return (
		<form onSubmit = { onSubmit } noValidate>
			<VStack>
				<For each = { fields() }>
					{ ( name ) => (
						<Field<T, typeof name>
							name = { name }
							value = { getFieldValue( name ) }
							render = { props.renderMap[ name ] }
							setValue = { setFieldValue( name ) }
						/>
					) }
				</For>
				<SubmitButton />
			</VStack>
		</form>
	);
}