import { Flex } from "@shaastra/ui/flex";
import LoginForm from "./login-form";

export default function Login() {
	return (
		<Flex
			direction = { "col" }
			align = { "center" }
			justify = { "center" }
			className = { "h-screen gap-2 p-8" }
		>
			<img src = { "/LightLogo.png" } alt = { "Shaastra Logo" } className = { "w-60 h-auto" } />
			<h2 className = { "font-light text-3xl" }>LOGIN</h2>
			<LoginForm />
		</Flex>
	);
}
