import { Icon } from "solid-heroicons";
import { createMemo, Show } from "solid-js";
import Spinner from "../spinner/spinner";
import HStack from "../stack/h-stack";
import type { Appearance, IconType } from "../utils/types";
import { VariantSchema } from "../utils/variant";

export interface BannerProps {
	className?: string;
	appearance?: Appearance;
	icon?: IconType;
	message: string;
	isLoading?: boolean;
	centered?: boolean;
}

const bannerVariantSchema = new VariantSchema(
	"p-4 rounded-md border font-semibold",
	{
		appearance: {
			default: "bg-light border-light-700 text-dark",
			primary: "bg-primary border-primary-700 text-light",
			warning: "bg-warning border-warning-700 text-dark",
			success: "bg-success border-success-700 text-light",
			danger: "bg-danger border-danger-700 text-light",
			alt: "bg-alt border-alt-700 text-light",
			info: "bg-info border-info-700 text-light"
		}
	},
	{ appearance: "primary" }
);

export default function Banner( props: BannerProps ) {
	const { appearance = "default", isLoading, icon, message, centered = false, className } = props;

	const bannerClassname = createMemo( () => {
		return `${ bannerVariantSchema.getClassname( { appearance } ) } ${ className }`;
	} );

	const spinnerAppearance = createMemo( () => {
		return appearance === "warning" || appearance === "default" ? "dark" : "default";
	} );

	return (
		<div class = { bannerClassname() }>
			<HStack centered = { centered } spacing = { "sm" }>
				<Show
					keyed
					when = { isLoading }
					fallback = {
						<Show keyed when = { !!icon && !isLoading }>
							<Icon width = { 20 } height = { 20 } path = { icon! }/>
						</Show>
					}
				>
					<Spinner size = { "sm" } appearance = { spinnerAppearance() }/>
				</Show>
				<h2>{ message }</h2>
			</HStack>
		</div>
	);
}