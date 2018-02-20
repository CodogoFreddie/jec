import { Card, Flex, } from "./toolbox";

const  Description = ({ children, }) =>
	!!children && <Flex> Description: {children} </Flex>;
const Project = ({ children, }) =>
	!!children && <Flex> Project: {children} </Flex>;
const Due = ({ children, }) => !!children && <Flex> Due: {children} </Flex>;
const Wait = ({ children, }) => !!children && <Flex> Wait: {children} </Flex>;
const Tags = ({ children, }) =>
	!!children && <Flex> Tags: {children.join(", ")} </Flex>;

export default ({ tasks, }) => (
	<Flex>
		{tasks.map(
			({ uuid, description, due, tags, id, project, wait, priority, }) => (
				<Card key = { uuid } title = { id } uuid = { uuid }>
					<Description>{description}</Description>
					<Project>{project}</Project>
					<Tags>{tags}</Tags>
					<Due>{due}</Due>
					<Wait>{wait}</Wait>
				</Card>
			),
		)}
	</Flex>
);
