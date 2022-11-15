import { Button, Flex, TextInput } from "@shaastra/ui";
import AuthLayout from "../../components/layout/auth-layout";

export default function Login() {
	return (
		<AuthLayout>
			<Flex
				direction = { "col" }
				align = { "center" }
				justify = { "center" }
				class = { "h-screen gap-2 p-8" }
			>
				<img src = { "/LightLogo.png" } alt = { "Shaastra Logo" } class = { "w-60 h-auto" } />
				<h2 class = { "font-light text-3xl" }>LOGIN</h2>
				<form>
					<TextInput name = { "rollNumber" } label = { "Roll Number" } />
					<TextInput name = { "email" } label = { "Email" } />
					<Button appearance = { "primary" } type = { "submit" } buttonText = { "Submit" } />
				</form>
			</Flex>
		</AuthLayout>
	);
}
