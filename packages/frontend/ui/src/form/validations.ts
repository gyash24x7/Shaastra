export type ValidatorFn<T> = ( value: T ) => string | undefined;

export function patternValidator( regex: RegExp, msg: string ): ValidatorFn<string> {
	return ( value: string ) => !regex.test( value as string ) ? msg : undefined;
}

export function minLengthValidator( minLength: number, msg: string ): ValidatorFn<string> {
	return ( value: string ) => value.length > minLength ? undefined : msg;
}

export function validate<T>( value: T, validators: Array<ValidatorFn<T>> ) {
	for ( const validator of validators ) {
		const msg = validator( value );
		console.log( !!msg );
		if ( !!msg ) {
			return msg;
		}
	}
	return;
}