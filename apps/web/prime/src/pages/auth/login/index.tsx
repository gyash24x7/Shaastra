import { Button, TextInput, VStack } from "@shaastra/ui";
import { lockClosed, user } from "solid-heroicons/solid";
import { createSignal } from "solid-js";
import DarkLogo from "../../../assets/DarkLogo.png";

export default function LoginPage() {
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
				placeholder = { "Enter your Password" }
				iconAfter = { lockClosed }
				value = { password }
				onChange = { setPassword }
			/>
			<Button appearance = { "primary" } type = { "submit" } buttonText = { "Submit" } fullWidth />
		</VStack>
	);
}
