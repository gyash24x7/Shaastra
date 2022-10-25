import { Button, Flex, Heading, Image, TextField, View } from "@adobe/react-spectrum";

export default function SignupPage() {
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
				<TextField label = { "Name" } width = { "100%" } marginBottom = { 10 } />
				<TextField label = { "Email" } width = { "100%" } marginBottom = { 10 } type = { "email" } />
				<TextField label = { "Roll Number" } width = { "100%" } marginBottom = { 10 } />
				<TextField
					label = { "Password" }
					width = { "100%" }
					marginBottom = { 10 }
					type = { "password" }
				/>
				<TextField
					label = { "Confirm Password" }
					width = { "100%" }
					marginBottom = { 10 }
					type = { "password" }
				/>
				<Button variant = { "cta" } width = { "100%" } marginY = { 10 }>Submit</Button>
			</View>
		</Flex>
	);
}