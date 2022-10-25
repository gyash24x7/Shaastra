import { Button, Flex, Heading, Image, TextField, View } from "@adobe/react-spectrum";
import { useState } from "react";

export default function LoginPage() {
	const [ username, setUsername ] = useState( "" );
	const [ password, setPassword ] = useState( "" );

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
				<Heading level = { 2 }>Login</Heading>
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
				<Button variant = { "cta" } width = { "100%" } marginY = { 10 }>Submit</Button>
			</View>
		</Flex>
	);
}