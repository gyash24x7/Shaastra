import "./index.css";
import "@fontsource/fjalla-one/400.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import { render } from "solid-js/web";

let disposeStory;

export const decorators = [
	( story ) => {
		if ( disposeStory ) {
			disposeStory();
		}

		const root = document.getElementById( "root" );
		const solidRoot = document.createElement( "div" );

		solidRoot.setAttribute( "id", "solid-root" );
		root.appendChild( solidRoot );

		disposeStory = render( story, solidRoot );

		return solidRoot;
	}
];