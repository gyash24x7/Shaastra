import type { Appearance, IconType } from "../utils/types";
import { Spinner } from "../spinner/spinner";
import { HStack } from "../stack/h-stack";
import { VariantSchema } from "../utils/variant";
import { Show } from "solid-js";
import { Icon } from "solid-heroicons";

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
	return (
		<div class = { `${ bannerVariantSchema.getClassname( { appearance } ) } ${ className }` }>
			<HStack centered = { centered }>
				<Show keyed when = { isLoading }>
					<Spinner
						data-testid = { "banner-spinner" }
						size = { "sm" }
						appearance = { appearance === "warning" || appearance === "default"
							? "dark"
							: "default" }
					/>
				</Show>
				<Show keyed when = { !!icon && !isLoading }>
					<Icon width = { 20 } height = { 20 } data-testid = { "banner-icon" } path = { icon! } />
				</Show>
				<h2 data-testid = { "banner-message" }>{ message }</h2>
			</HStack>
		</div>
	);
}