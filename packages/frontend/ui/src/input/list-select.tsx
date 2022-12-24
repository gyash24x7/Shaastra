import {
	HeadlessDisclosureChild,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition
} from "solid-headless";
import { Icon } from "solid-heroicons";
import { checkCircle, chevronUpDown } from "solid-heroicons/solid";
import { For, Show } from "solid-js";
import { VariantSchema } from "../utils/variant";
import InputMessage from "./input-message";

export type SelectOption<T = any> = { label: string, value: T };

export interface ListSelectProps<T = any> {
	name: string;
	options: SelectOption<T>[],
	label?: string;
	placeholder?: string;
	value?: SelectOption<T>;
	onChange: ( value?: SelectOption<T> ) => void;
	appearance?: "default" | "success" | "danger"
	message?: string;
}

const optionVS = new VariantSchema(
	"cursor-default select-none relative py-2 pl-10 pr-4 text-dark",
	{ active: { true: "text-primary bg-primary-100", false: "" } },
	{ active: "false" }
);

const optionIconVS = new VariantSchema(
	"absolute inset-y-0 left-0 flex items-center pl-3 text-dark",
	{ active: { true: "text-primary", false: "" } },
	{ active: "false" }
);

interface ListSelectOptionProps<T> {
	option: SelectOption<T>;
}

function ListSelectOption<T>( { option }: ListSelectOptionProps<T> ) {
	const optionClassname = ( active: boolean ) => {
		return optionVS.getClassname( { active: active ? "true" : "false" } );
	};

	const optionIconClassname = ( active: boolean ) => {
		return optionIconVS.getClassname( { active: active ? "true" : "false" } );
	};

	return (
		<ListboxOption value = { option }>
			{ ( { isSelected, isActive } ) => (
				<div class = { optionClassname( isActive() ) }>
					<span class = { "block truncate" }>{ option.label }</span>
					<Show when = { isSelected() } keyed>
						<span class = { optionIconClassname( isActive() ) }>
							<Icon path = { checkCircle } class = { "w-4 h-4" } aria-hidden = "true"/>
						</span>
					</Show>
				</div>
			) }
		</ListboxOption>
	);
}

export default function ListSelect<T>( props: ListSelectProps<T> ) {
	return (
		<div class = { "w-full" }>
			<Listbox<SelectOption<T>>
				defaultOpen = { false }
				value = { props.value || props.options[ 0 ] }
				onSelectChange = { props.onChange }
			>
				<Show when = { !!props.label } keyed>
					<label class = { "text-sm text-dark-100 font-semibold" } for = { props.name }>
						{ props.label }
					</label>
				</Show>
				<div
					class = {
						"flex w-full text-left rounded-md cursor-default"
						+ "focus:outline-none focus-visible:ring-0 overflow-hidden "
						+ "border-2 border-light-700 text-dark p-2 text-base"
					}
				>
					<ListboxButton class = { "h-5 text-light-700 flex items-center w-full justify-between" }>
						<span>{ props.placeholder }</span>
						<Icon path = { chevronUpDown } aria-hidden = "true" class = { "w-3 h-3" }/>
					</ListboxButton>
				</div>
				<HeadlessDisclosureChild>
					{ ( { isOpen } ) => (
						<Transition
							leave = { "transition ease-in duration-100" }
							leaveFrom = { "opacity-100" }
							leaveTo = { "opacity-0" }
							show = { isOpen() }
						>
							<ListboxOptions
								class = {
									"absolute w-full py-1 mt-1 bg-light-100 rounded-md "
									+ "border border-light-700 max-h-60 text-base"
								}
							>
								<For each = { props.options }>
									{ ( option ) => <ListSelectOption option = { option }/> }
								</For>
							</ListboxOptions>
						</Transition>
					) }
				</HeadlessDisclosureChild>
				<Show keyed when = { !!props.message }>
					<InputMessage text = { props.message! } appearance = { props.appearance }/>
				</Show>
			</Listbox>
		</div>
	);
}