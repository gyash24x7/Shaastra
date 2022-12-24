import { Dialog, DialogDescription, DialogOverlay, DialogTitle, Transition, TransitionChild } from "solid-headless";
import { createMemo, JSXElement, Show } from "solid-js";
import { VariantSchema } from "../utils/variant";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children?: JSXElement;
}

export function ModalTitle( props: { title: string } ) {
	return (
		<DialogTitle as = "h3" class = { "text-xl font-semibold leading-6 mb-4" }>
			{ props.title }
		</DialogTitle>
	);
}

const modalBodyVS = new VariantSchema(
	"text-base",
	{ withTitle: { true: "mt-4", false: "" } },
	{ withTitle: "false" }
);

export default function Modal( { isOpen, onClose, children, title }: ModalProps ) {
	const modalBodyClassname = createMemo( () => {
		return modalBodyVS.getClassname( { withTitle: !!title ? "true" : "false" } );
	} );

	return (
		<Transition appear show = { isOpen }>
			<Dialog class = { "fixed inset-0 z-10 overflow-y-auto" } onClose = { onClose } isOpen>
				<div class = { "min-h-screen px-4 text-center" }>
					<TransitionChild
						enter = "ease-out duration-300"
						enterFrom = "opacity-0"
						enterTo = "opacity-100"
						leave = "ease-in duration-200"
						leaveFrom = "opacity-100"
						leaveTo = "opacity-0"
					>
						<DialogOverlay class = { "fixed inset-0 bg-dark-700/50" }/>
					</TransitionChild>
					<span class = { "inline-block h-screen align-middle" } aria-hidden = "true"/>
					<TransitionChild
						enter = "ease-out duration-300"
						enterFrom = "opacity-0 scale-90"
						enterTo = "opacity-100 scale-100"
						leave = "ease-in duration-200"
						leaveFrom = "opacity-100 scale-100"
						leaveTo = "opacity-0 scale-90"
					>
						<div
							style = { { "max-width": "600px" } }
							class = {
								"inline-block p-6 my-8 overflow-hidden text-left align-middle "
								+ "transition-all transform bg-light-100 shadow-xl rounded-md "
								+ "w-5/6 sm:w-4/5 md:w-3/5 lg:w-1/2"
							}
						>
							<Show when = { !!title } keyed>
								<ModalTitle title = { title! }/>
							</Show>
							<Show when = { !!children } keyed>
								<div class = { modalBodyClassname() }>
									<DialogDescription>
										{ children }
									</DialogDescription>
								</div>
							</Show>
						</div>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	);
}