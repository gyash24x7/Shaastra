import Card, { CardProps } from "./card";

export default { component: Card, title: "Card" };


const Template: any = args => <Card { ...args } />;

export const Playground = Template.bind( {} );
Playground.args = { title: "Card Title", content: "This is Card Content" } as CardProps;