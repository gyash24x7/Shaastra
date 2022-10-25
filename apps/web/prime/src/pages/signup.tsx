import { Button, Flex, Heading, Image, TextField, View } from "@adobe/react-spectrum";
import { useState } from "react";

export default function SignupPage() {
	const [ name, setName ] = useState( "" );
	const [ email, setEmail ] = useState( "" );
	const [ username, setUsername ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const [ confirmPassword, setConfirmPassword ] = useState( "" );

	return (
		<Flex width = { "100vw" } height = { "100vh" }>
			<Image src = { "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" } />
			<View
				minWidth = { 400 }
				height = { "100%" }
				width = { "30vw" }
				padding = { 40 }
				borderStartWidth = { "thin" }
			>
				<Heading level = { 2 }>Sign Up</Heading>
				<TextField
					label = { "Name" }
					width = { "100%" }
					marginBottom = { 10 }
					value = { name }
					onChange = { setName }
				/>
				<TextField
					label = { "Email" }
					width = { "100%" }
					marginBottom = { 10 }
					type = { "email" }
					value = { email }
					onChange = { setEmail }
				/>
				<TextField
					label = { "Roll Number" }
					width = { "100%" }
					marginBottom = { 10 }
					value = { username }
					onChange = { setUsername }
				/>
				<TextField
					label = { "Password" }
					width = { "100%" }
					marginBottom = { 10 }
					type = { "password" }
					value = { password }
					onChange = { setPassword }
				/>
				<TextField
					label = { "Confirm Password" }
					width = { "100%" }
					marginBottom = { 10 }
					type = { "password" }
					value = { confirmPassword }
					onChange = { setConfirmPassword }
				/>
				<Button variant = { "cta" } width = { "100%" } marginY = { 10 }>Submit</Button>
			</View>
		</Flex>
	);
}