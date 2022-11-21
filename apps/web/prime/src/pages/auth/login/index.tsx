import { Banner, Button, Form, minLengthValidator, patternValidator, TextInput, VStack } from "@shaastra/ui";
import { exclamationTriangle, lockClosed, user } from "solid-heroicons/solid";
import { Show } from "solid-js";
import DarkLogo from "../../../assets/DarkLogo.png";
import { createLoginMutation } from "@shaastra/client";

export const rollNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z][0-9]{3}$/;

export default function LoginPage() {
	const { mutate, error, loading } = createLoginMutation( {
		onSuccess( data ) {
			console.log( data );
		}
	} );

	return (
		<VStack className = { "h-screen p-8" }>
			<img src = { DarkLogo } alt = { "Shaastra Logo" } class = { "w-60 h-auto mx-auto my-4" } />
			<h2 class = { "font-light text-3xl" }>LOGIN</h2>
			<Form
				initialValue = { { rollNumber: "", password: "" } }
				onSubmit = { ( { password, rollNumber } ) => mutate( { username: rollNumber, password } ) }
				submitBtn = { () => {
					return (
						<Button
							appearance = { "primary" }
							type = { "submit" }
							buttonText = { "Submit" }
							fullWidth
							isLoading = { loading() }
						/>
					);
				} }
				renderMap = { {
					rollNumber( { touched, error, ...props } ) {
						const appearance = () => !!touched ? !!error ? "danger" : "success" : "default";
						const message = () => !!touched ? !!error ? error : "Looks Good!" : "";
						return (
							<TextInput
								{ ...props }
								label = { "Roll Number" }
								placeholder = { "Enter your Roll Number" }
								iconAfter = { user }
								appearance = { appearance() }
								message = { message() }
							/>
						);
					},
					password( { touched, error, ...props } ) {
						const appearance = () => !!touched ? !!error ? "danger" : "success" : "default";
						const message = () => !!touched ? !!error ? error : "Looks Good!" : "";

						return (
							<TextInput
								{ ...props }
								type = { "password" }
								label = { "Password" }
								placeholder = { "Enter you Password" }
								iconAfter = { lockClosed }
								appearance = { appearance() }
								message = { message() }
							/>
						);
					}
				} }
				validations = { {
					rollNumber: [ patternValidator( rollNumberRegex, "Invalid Roll Number!" ) ],
					password: [ minLengthValidator( 8, "Password too Short!" ) ]
				} }
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
