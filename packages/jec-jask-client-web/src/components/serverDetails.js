import { Button, TextInput, } from "./toolbox";

const onChangeToLocalStorage = key => e => (localStorage[key] = e.target.value);

export default () => (
	<div>
		<TextInput
			label = "Server Port"
			value = { localStorage.serverPort }
			onChange = { onChangeToLocalStorage("serverPort") }
		/>
		<TextInput
			label = "Server Address"
			value = { localStorage.serverAddress }
			onChange = { onChangeToLocalStorage("serverAddress") }
		/>
		<TextInput
			label = "Server Key"
			value = { localStorage.serverKey }
			onChange = { onChangeToLocalStorage("serverKey") }
		/>

		<Button
			onClick = { () => {
				window.location = window.location;
			} }
		>
			Save
		</Button>
	</div>
);
