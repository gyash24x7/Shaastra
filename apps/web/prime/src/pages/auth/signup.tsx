import {
	UserIcon,
	LockClosedIcon,
	ExclamationCircleIcon,
	EnvelopeIcon,
	CheckCircleIcon
} from "@heroicons/react/24/solid";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/solid/index.js";
import { useCreateMemberMutation, Department } from "@shaastra/client";
import {
	Banner,
	emailValidator,
	Form,
	minLengthValidator,
	requiredValidator,
	rollNumberValidator,
	TextInput,
	VStack,
	Flex,
	ListSelect
} from "@shaastra/ui";
import { When, If, Then, Else } from "react-if";
import { Link } from "react-router-dom";

const departments: Department[] = [
	Department.ENVISAGE,
	Department.EVOLVE,
	Department.FINANCE,
	Department.PUBLICITY,
	Department.QMS,
	Department.WEBOPS,
	Department.CONCEPT_AND_DESIGN,
	Department.EVENTS_AND_WORKSHOPS,
	Department.OPERATIONS_AND_INFRASTRUCTURE_PLANNING,
	Department.SHOWS_AND_EXHIBITIONS,
	Department.SPONSORSHIP_AND_PR
];

export default function SignUpPage() {
	const { mutateAsync, data, isLoading, isError } = useCreateMemberMutation();

	return (
		<VStack className={ "h-screen p-8" }>
			<img src={ "/images/DarkLogo.png" } alt={ "Shaastra Logo" } className={ "w-60 h-auto mx-auto my-4" }/>
			<h2 className={ "font-light text-3xl" }>SIGN UP</h2>
			<If condition={ !!data }>
				<Then>
					<Banner
						message={ "Verification Email has been sent to your email!" }
						appearance={ "success" }
						renderIcon={ ( props ) => <CheckCircleIcon { ...props }/> }
					/>
				</Then>
				<Else>
					<VStack>
						<Form
							isLoading={ isLoading }
							initialValue={ {
								name: "",
								email: "",
								rollNumber: "",
								password: "",
								mobile: "",
								department: Department.WEBOPS
							} }
							onSubmit={ ( data ) => mutateAsync( data ) }
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
								rollNumber: [ rollNumberValidator( "Invalid Roll Number!" ) ],
								password: [ minLengthValidator( 7, "Password too Short!" ) ],
								mobile: [ requiredValidator( "Mobile Number is Required!" ) ],
								department: [ requiredValidator( "Department is Required!" ) ]
							} }
						/>
						<Flex justify={ "space-between" }>
							<span>Already have an account?</span>
							<span><Link to={ "/auth/login" }>Login</Link></span>
						</Flex>
					</VStack>
					<When condition={ isError }>
						<Banner
							message={ "Some Error!" }
							appearance={ "danger" }
							renderIcon={ ( props ) => <ExclamationCircleIcon { ...props }/> }
						/>
					</When>
				</Else>
			</If>
		</VStack>
	);
}
