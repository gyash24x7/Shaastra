import { arrowLeft, arrowRight } from "solid-heroicons/solid";
import type { JSXElement } from "solid-js";
import { createSignal, Show } from "solid-js";
import Button from "../button/button";
import HStack from "../stack/h-stack";

export interface StepperStep {
	name: string;
	content: JSXElement;
}

export interface StepperProps {
	steps: StepperStep[];
	onEnd: () => void | Promise<void>;
	isLoading?: boolean;
}

interface StepperButtonProps {
	onClick: () => void | Promise<void>;
	isLoading?: boolean;
}

const PreviousButton = ( props: StepperButtonProps & { disabled?: boolean } ) => (
	<Button iconBefore = { arrowLeft } size = { "sm" } appearance = { "default" } { ...props } />
);

const NextButton = ( props: StepperButtonProps ) => (
	<Button iconAfter = { arrowRight } size = { "sm" } appearance = { "primary" } { ...props } />
);

const EndButton = ( props: StepperButtonProps ) => (
	<Button buttonText = { "Submit" } size = { "sm" } appearance = { "primary" } { ...props } />
);

export default function Stepper( props: StepperProps ) {
	const stepMap: Record<string, JSXElement> = {};
	const stepNames: string[] = [];

	props.steps.forEach( step => {
		stepMap[ step.name ] = step.content;
		stepNames.push( step.name );
	} );

	const [ activeStep, setActiveStep ] = createSignal( stepNames[ 0 ] );

	const handlePrevious = () => {
		for ( let i = 1; i < stepNames.length; i++ ) {
			const stepName = stepNames[ i ];
			if ( stepName === activeStep() ) {
				setActiveStep( stepNames[ i - 1 ] );
				break;
			}
		}
	};

	const handleNext = () => {
		for ( let i = 0; i < stepNames.length - 1; i++ ) {
			const stepName = stepNames[ i ];
			if ( stepName === activeStep() ) {
				setActiveStep( stepNames[ i + 1 ] );
				break;
			}
		}
	};

	return (
		<>
			{ stepMap[ activeStep() ] }
			<Show
				when = { activeStep() === stepNames[ stepNames.length - 1 ] }
				keyed
				fallback = {
					<HStack className = { "mt-6" } spacing = { "sm" }>
						<PreviousButton
							onClick = { handlePrevious }
							disabled = { stepNames[ 0 ] === activeStep() }
						/>
						<NextButton onClick = { handleNext } />
					</HStack>
				}
			>
				<HStack className = { "mt-6" } spacing = { "sm" }>
					<PreviousButton onClick = { handlePrevious } />
					<EndButton onClick = { props.onEnd } isLoading = { props.isLoading } />
				</HStack>
			</Show>
		</>
	);
}