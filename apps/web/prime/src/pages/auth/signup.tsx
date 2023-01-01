import {
	Banner,
	Button,
	emailValidator,
	Form,
	ListSelect,
	minLengthValidator,
	mobileValidator,
	requiredValidator,
	rollNumberValidator,
	TextInput,
	VStack
} from "@shaastra/ui";
import { envelope, exclamationTriangle, lockClosed, user } from "solid-heroicons/solid";
import { Show } from "solid-js";

export default function SignUpPage() {
	return (
		<VStack className = { "h-screen p-8" }>
			<img src = { "/images/DarkLogo.png" } alt = { "Shaastra Logo" } class = { "w-60 h-auto mx-auto my-4" }/>
			<h2 class = { "font-light text-3xl" }>SIGN UP</h2>
			<Form
				initialValue = { { rollNumber: "", password: "", name: "", email: "", mobile: "", department: "" } }
				onSubmit = { ( { password, rollNumber }: any ) => console.log( { username: rollNumber, password } ) }
				submitBtn = { () => {
					return (
						<Button
							appearance = { "primary" }
							type = { "submit" }
							buttonText = { "Submit" }
							fullWidth
						/>
					);
				} }
				renderMap = { {
					name: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							label = { "Name" }
							placeholder = { "Enter your Name" }
							appearance = { appearance }
							message = { error }
						/>
					),
					email: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							label = { "Email" }
							placeholder = { "Enter your Email" }
							iconAfter = { envelope }
							appearance = { appearance }
							message = { error }
						/>
					),
					rollNumber: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							label = { "Roll Number" }
							placeholder = { "Enter your Roll Number" }
							iconAfter = { user }
							appearance = { appearance }
							message = { error }
						/>
					),
					password: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							type = { "password" }
							label = { "Password" }
							placeholder = { "Enter you Password" }
							iconAfter = { lockClosed }
							appearance = { appearance }
							message = { error }
						/>
					),
					mobile: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							label = { "Mobile" }
							placeholder = { "Enter your 10 digit Mobile Number" }
							iconAfter = { user }
							appearance = { appearance }
							message = { error }
						/>
					),
					department: ( { appearance, error, value, setValue, name } ) => (
						<ListSelect<string>
							name = { name }
							options = { [] }
							onChange = { ( { value } ) => setValue( value ) }
							appearance = { appearance }
							message = { error }
							value = { { label: "Department", value: value() } }
						/>
					)
				} }
				validations = { {
					name: [ requiredValidator( "Name is Required!" ) ],
					email: [ emailValidator( "Invalid Email" ) ],
					mobile: [ mobileValidator( "Invalid Mobile Number!" ) ],
					department: [ requiredValidator( "Department is Required!" ) ],
					rollNumber: [ rollNumberValidator( "Invalid Roll Number!" ) ],
					password: [ minLengthValidator( 8, "Password too Short!" ) ]
				} }
			/>
			<Show when = { false } keyed>
				<Banner
					message = { "Some Error!" }
					appearance = { "danger" }
					icon = { exclamationTriangle }
				/>
			</Show>
		</VStack>
	);
}
