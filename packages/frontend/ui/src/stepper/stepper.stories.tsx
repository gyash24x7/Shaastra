import type { Meta, StoryObj } from "@storybook/react";
import Stepper from "./stepper";

const meta: Meta<typeof Stepper> = { component: Stepper, title: "Stepper" };

export default meta;

export const Playground: StoryObj<typeof Stepper> = {
	render: ( props ) => <Stepper { ...props } />,
	args: {
		steps: [
			{ name: "Step 1", content: <h1>Step 1</h1> },
			{ name: "Step 2", content: <h1>Step 2</h1> },
			{ name: "Step 3", content: <h1>Step 3</h1> }
		],
		onEnd: () => console.log( "On End Called!" )
	}
};