import type { Meta, StoryObj } from "@storybook/react";
import Card from "./card";

const meta: Meta<typeof Card> = { component: Card, title: "Card" };

export default meta;

export const Playground: StoryObj<typeof Card> = {
	render: ( props ) => <Card { ...props } />,
	args: { title: "Card Title", content: "This is Card Content" }
};