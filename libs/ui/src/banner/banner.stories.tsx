import type { ComponentMeta, ComponentStory } from "@storybook/react";
import type { Appearance } from "../utils";
import Banner, { BannerProps } from "./banner";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

const meta: ComponentMeta<typeof Banner> = {
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

export default meta;

const Template: ComponentStory<typeof Banner> = args => <Banner { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { appearance: "default" } as BannerProps;

export const BannerWithIcon = Template.bind( {} );
BannerWithIcon.args = { appearance: "default", icon: ExclamationCircleIcon } as BannerProps;