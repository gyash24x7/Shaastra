import { Banner, Button, TextInput, VStack } from "@shaastra/ui";
import { exclamationTriangle, lockClosed, user } from "solid-heroicons/solid";
import { createSignal, Show } from "solid-js";
import DarkLogo from "../../../assets/DarkLogo.png";
import { createLoginMutation } from "@shaastra/client";

export const patternValidator = ( regex: RegExp, msg: string ) => {
	return ( value: string ) => !regex.test( value ) ? msg : undefined;
};
export const rollNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z][0-9]{3}$/;

export default function LoginPage() {
	const { mutate, error, loading } = createLoginMutation( {
		onSuccess( data ) {
			console.log( data );
		}
	} );

	const [ rollNumber, setRollNumber ] = createSignal( "" );
	const [ password, setPassword ] = createSignal( "" );

	return (
		<VStack className = { "h-screen p-8" }>
			<img src = { DarkLogo } alt = { "Shaastra Logo" } class = { "w-60 h-auto mx-auto my-4" } />
			<h2 class = { "font-light text-3xl" }>LOGIN</h2>
			<TextInput
				name = { "rollNumber" }
				label = { "Roll Number" }
				placeholder = { "Enter your Roll Number" }
				iconAfter = { user }
				value = { rollNumber }
				onChange = { setRollNumber }
			/>
			<TextInput
				name = { "password" }
				label = { "Password" }
				type = { "password" }
				placeholder = { "Enter your Password" }
				iconAfter = { lockClosed }
				value = { password }
				onChange = { setPassword }
			/>
			<Button
				appearance = { "primary" }
				type = { "submit" }
				buttonText = { "Submit" }
				fullWidth
				isLoading = { loading() }
				onClick = { () => mutate( { username: rollNumber(), password: password() } ) }
			/>
			<Show when = { !!error() } keyed>
				<Banner
					message = { error()!.message }
					appearance = { "danger" }
					icon = { exclamationTriangle }
				/>
			</Show>
		</VStack>
	);
}
