import { Stepper, StepperProps } from "./stepper";
import type { ComponentMeta, ComponentStory } from "@storybook/react";


const meta: ComponentMeta<typeof Stepper> = { component: Stepper, title: "Stepper" };
export default meta;

const Template: ComponentStory<typeof Stepper> = args => <Stepper { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = {
	steps: [
		{ name: "Step 1", content: <h1>Step 1</h1> },
		{ name: "Step 2", content: <h1>Step 2</h1> },
		{ name: "Step 3", content: <h1>Step 3</h1> }
	],
	onEnd: () => console.log( "On End Called!" )
} as StepperProps;