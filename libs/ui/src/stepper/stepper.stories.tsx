import Stepper, { StepperProps } from "./stepper";

export default { component: Stepper, title: "Stepper" };


const Template: any = args => <Stepper { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	steps: [
		{ name: "Step 1", content: <h1>Step 1</h1> },
		{ name: "Step 2", content: <h1>Step 2</h1> },
		{ name: "Step 3", content: <h1>Step 3</h1> }
	],
	onEnd: () => console.log( "On End Called!" )
} as StepperProps;