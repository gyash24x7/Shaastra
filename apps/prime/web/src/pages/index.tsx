import { Button } from "@prime/ui";
import { useAuth } from "../utils/auth";

export default function HomePage() {
	const { logout } = useAuth();

	return (
		<main className="text-center mx-auto text-gray-700 p-4">
			<h1 className="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
				Hello world!
			</h1>
			<Button buttonText={ "Logout" } appearance={ "danger" } onClick={ logout }/>
		</main>
	);
}
