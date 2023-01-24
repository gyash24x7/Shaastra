import { Button } from "@shaastra/ui";
import { useAuth } from "../auth/provider.js";

export default function HomePage() {
	const { refresh } = useAuth();

	return (
		<main className="text-center mx-auto text-gray-700 p-4">
			<h1 className="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
				Hello world!
			</h1>
			<Button buttonText={ "Logout" } appearance={ "danger" } onClick={ refresh }/>
		</main>
	);
}
