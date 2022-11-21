import type { Appearance } from "../utils";
import Banner, { BannerProps } from "./banner";
import { exclamationCircle } from "solid-heroicons/solid";
import type { JSX } from "solid-js/jsx-runtime";

export default {
	component: Banner,
	title: "Banner",
	argTypes: {
		icon: {
			description: "Sets the icon before the banner message"
		},
		isLoading: {
			description: "Sets loading state of the banner",
			defaultValue: false,
			control: { type: "boolean" }
		},
		message: {
			description: "Sets the message inside the banner",
			defaultValue: "This is a cool banner message",
			control: { type: "text" }
		},
		appearance: {
			options: [ "primary", "default", "danger", "info", "alt", "warning", "success" ] as Appearance[],
			control: { type: "inline-radio" },
			defaultValue: "default",
			description: "Sets the appearance of the banner"
		}
	}
};


const Template: any = ( args: JSX.IntrinsicAttributes & BannerProps ) => <Banner { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { appearance: "default" } as BannerProps;

export const BannerWithIcon = Template.bind( {} );
BannerWithIcon.args = { appearance: "default", icon: exclamationCircle } as BannerProps;