// @refresh reload
import { Suspense } from "solid-js";
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title } from "solid-start";
import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "./styles/global.css";

export default function Root() {
	return (
		<Html lang = "en">
			<Head>
				<Title>Shaastra Prime</Title>
				<Meta charset = "utf-8"/>
				<Meta name = "viewport" content = "width=device-width, initial-scale=1"/>
			</Head>
			<Body>
				<ErrorBoundary>
					<Suspense fallback = { <div>Loading</div> }>
						<Routes>
							<FileRoutes/>
						</Routes>
					</Suspense>
				</ErrorBoundary>
				<Scripts/>
			</Body>
		</Html>
	);
}
