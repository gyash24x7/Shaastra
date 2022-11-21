import type { JSXElement } from "solid-js";
import { createEffect, createSignal, For } from "solid-js";
import type { FieldOf, FieldRenderFn, FieldValueOf } from "./field";
import Field from "./field";
import { VStack } from "../stack";
import { produce } from "solid-js/store";
import type { ValidatorFn } from "./validations";
import { validate } from "./validations";

type FieldData<P, V = any> = Record<FieldOf<P>, V>;

type Fields<T> = Array<FieldOf<T>>;

export type CreateFormOptions<T> = {
	initialValue: T;
	onSubmit?: ( values: T ) => void | Promise<void>
}

function buildInitialValues<T extends Object, R>( initialValue: T, initializeWith: R ): FieldData<T, R> {
	const keys = Object.keys( initialValue ) as Array<FieldOf<T>>;
	const initMap = {} as FieldData<T, R>;
	keys.forEach( key => {
		initMap[ key ] = initializeWith;
	} );
	return initMap;
}

export function createForm<T extends Object>( options: CreateFormOptions<T> ) {
	const [ fields ] = createSignal( Object.keys( options.initialValue ) as Fields<T> );
	const [ values, setValues ] = createSignal( options.initialValue );
	const [ errors, setErrors ] = createSignal( buildInitialValues( options.initialValue, "" ) );
	const [ touched, setTouched ] = createSignal( buildInitialValues( options.initialValue, false ) );

	const getFieldValue = ( name: FieldOf<T> ) => (): FieldValueOf<T, typeof name> => values()[ name ];

	const setFieldValue = (
		name: FieldOf<T>,
		validators: Array<ValidatorFn<FieldValueOf<T, typeof name>>> = []
	) => {
		return ( value: FieldValueOf<T, typeof name> ) => {
			setFieldTouched( name, true );

			setValues( produce( values => (
				values[ name ] = value
			) ) );

			const errMsg = validate( value, validators );

			if ( !!errMsg ) {
				setFieldError( name, errMsg );
			} else {
				setFieldError( name, "" );
			}

		};
	};

	const getFieldError = ( name: FieldOf<T> ) => errors()[ name ];

	const setFieldError = ( name: FieldOf<T>, error: string ) => {
		setErrors( errors => (
			{ ...errors, [ name ]: error }
		) );
	};

	const getFieldTouched = ( name: FieldOf<T> ) => touched()[ name ];

	const setFieldTouched = ( name: FieldOf<T>, value: boolean ) => {
		setTouched( produce( touched => (
			touched[ name ] = value
		) ) );
	};

	const onSubmit = ( e: Event ) => {
		e.preventDefault();
		if ( options.onSubmit ) {
			options.onSubmit( values() );
		}
	};

	return {
		values,
		setFieldValue,
		getFieldError,
		setFieldError,
		fields,
		onSubmit,
		getFieldValue,
		getFieldTouched
	};
}

export interface FormProps<T> {
	initialValue: T;
	onSubmit?: ( values: T ) => void | Promise<void>;
	submitBtn: () => JSXElement;
	renderMap: Record<FieldOf<T>, FieldRenderFn<T, FieldOf<T>>>;
	validations?: Record<FieldOf<T>, Array<ValidatorFn<FieldValueOf<T, FieldOf<T>>>>>;
}

export default function Form<T extends Object>( { validations, ...props }: FormProps<T> ) {
	const {
		onSubmit,
		getFieldValue,
		setFieldValue,
		fields,
		getFieldError,
		values,
		getFieldTouched
	} = createForm<T>( props );
	const SubmitButton = props.submitBtn;

	createEffect( () => {
		console.log( values() );
	} );

	return (
		<form onSubmit = { onSubmit } noValidate>
			<VStack>
				<For each = { fields() }>
					{ ( name ) => (
						<Field<T, typeof name>
							name = { name }
							value = { getFieldValue( name ) }
							render = { props.renderMap[ name ] }
							setValue = { setFieldValue( name, validations ? validations[ name ] : [] ) }
							error = { getFieldError( name ) }
							touched = { getFieldTouched( name ) }
						/>
					) }
				</For>
				<SubmitButton />
			</VStack>
		</form>
	);
}