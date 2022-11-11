import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { Card, CardProps } from "./card";
import React from "react";

const meta: ComponentMeta<typeof Card> = { component: Card, title: "Card" };
export default meta;

const Template: ComponentStory<typeof Card> = args => <Card { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { title: "Card Title", content: "This is Card Content" } as CardProps;