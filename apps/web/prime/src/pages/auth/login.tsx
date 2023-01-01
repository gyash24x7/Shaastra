import { Banner, Button, Form, minLengthValidator, patternValidator, TextInput, VStack } from "@shaastra/ui";
import { exclamationTriangle, lockClosed, user } from "solid-heroicons/solid";
import { Show } from "solid-js";

export const rollNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z][0-9]{3}$/;

export default function LoginPage() {
	return (
		<VStack className = { "h-screen p-8" }>
			<img src = { "/images/DarkLogo.png" } alt = { "Shaastra Logo" } class = { "w-60 h-auto mx-auto my-4" }/>
			<h2 class = { "font-light text-3xl" }>LOGIN</h2>
			<Form
				initialValue = { { rollNumber: "", password: "" } }
				onSubmit = { ( { password, rollNumber }: any ) => console.log( { username: rollNumber, password } ) }
				submitBtn = { () => {
					return (
						<Button
							appearance = { "primary" }
							type = { "submit" }
							buttonText = { "Submit" }
							fullWidth
						/>
					);
				} }
				renderMap = { {
					rollNumber( { touched, error, ...props }: any ) {
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
					password( { touched, error, ...props }: any ) {
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
			<Show when = { false } keyed>
				<Banner
					message = { "Some Error!" }
					appearance = { "danger" }
					icon = { exclamationTriangle }
				/>
			</Show>
		</VStack>
	);
}
