import { Button, Flex, TextInput } from "@shaastra/ui";
import AuthLayout from "../auth.layout";
import DarkLogo from "../../../public/DarkLogo.png";

export function Page() {
	return (
		<AuthLayout>
			<Flex
				direction = { "col" }
				align = { "stretch" }
				justify = { "center" }
				className = { "h-screen gap-2 p-8" }
			>
				<img src = { DarkLogo } alt = { "Shaastra Logo" } class = { "w-60 h-auto mx-auto my-4" } />
				<h2 class = { "font-light text-3xl" }>LOGIN</h2>
				<TextInput name = { "rollNumber" } label = { "Roll Number" } />
				<TextInput name = { "email" } label = { "Email" } />
				<Button appearance = { "primary" } type = { "submit" } buttonText = { "Submit" } />
			</Flex>
		</AuthLayout>
	);
}
