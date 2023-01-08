import {
	UserIcon,
	LockClosedIcon,
	ExclamationCircleIcon,
	EnvelopeIcon,
	DevicePhoneMobileIcon
} from "@heroicons/react/24/solid";
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
	VStack,
	Flex
} from "@shaastra/ui";
import { When } from "react-if";
import { Link } from "react-router-dom";

const departments = [ "WEBOPS" ];

export default function SignUpPage() {
	return (
		<VStack className={ "h-screen p-8" }>
			<img src={ "/images/DarkLogo.png" } alt={ "Shaastra Logo" } className={ "w-60 h-auto mx-auto my-4" }/>
			<h2 className={ "font-light text-3xl" }>SIGN UP</h2>
			<Form
				initialValue={ { rollNumber: "", password: "", name: "", email: "", mobile: "", department: "" } }
				onSubmit={ ( { password, rollNumber }: any ) => console.log( { username: rollNumber, password } ) }
				submitBtn={ () => {
					return (
						<Button
							appearance={ "primary" }
							type={ "submit" }
							buttonText={ "Submit" }
							fullWidth
						/>
					);
				} }
				renderMap={ {
					name: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							label={ "Name" }
							placeholder={ "Enter your Name" }
							appearance={ appearance }
							message={ error }
						/>
					),
					email: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							label={ "Email" }
							placeholder={ "Enter your Email" }
							renderIconAfter={ ( props ) => <EnvelopeIcon { ...props }/> }
							appearance={ appearance }
							message={ error }
						/>
					),
					rollNumber: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							label={ "Roll Number" }
							placeholder={ "Enter your Roll Number" }
							renderIconAfter={ ( props ) => <UserIcon { ...props }/> }
							appearance={ appearance }
							message={ error }
						/>
					),
					password: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							type={ "password" }
							label={ "Password" }
							placeholder={ "Enter you Password" }
							renderIconAfter={ ( props ) => <LockClosedIcon { ...props }/> }
							appearance={ appearance }
							message={ error }
						/>
					),
					mobile: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							label={ "Mobile" }
							placeholder={ "Enter your 10 digit Mobile Number" }
							renderIconAfter={ ( props ) => <DevicePhoneMobileIcon { ...props }/> }
							appearance={ appearance }
							message={ error }
						/>
					),
					department: ( { appearance, error, value, setValue, name } ) => (
						<ListSelect<string>
							label={ "Department" }
							placeholder={ "Select Department" }
							name={ name }
							options={ departments.map( d => (
								{ label: d, value: d }
							) ) }
							onChange={ ( { value } ) => setValue( value ) }
							appearance={ appearance }
							message={ error }
							value={ { label: value, value } }
						/>
					)
				} }
				validations={ {
					name: [ requiredValidator( "Name is Required!" ) ],
					email: [ emailValidator( "Invalid Email" ) ],
					mobile: [ mobileValidator( "Invalid Mobile Number!" ) ],
					department: [ requiredValidator( "Department is Required!" ) ],
					rollNumber: [ rollNumberValidator( "Invalid Roll Number!" ) ],
					password: [ minLengthValidator( 8, "Password too Short!" ) ]
				} }
			/>
			<Flex justify={ "space-between" }>
				<span>Already have an account?</span>
				<span>
					<Link to={ "/auth/login" }>Login</Link>
				</span>
			</Flex>
			<When condition={ false }>
				<Banner
					message={ "Some Error!" }
					appearance={ "danger" }
					renderIcon={ ( props ) => <ExclamationCircleIcon { ...props }/> }
				/>
			</When>
		</VStack>
	);
}
