import {
	UserIcon,
	LockClosedIcon,
	ExclamationCircleIcon,
	EnvelopeIcon,
	CheckCircleIcon
} from "@heroicons/react/24/solid";
import { useSignupMutation } from "@shaastra/client";
import {
	Banner,
	emailValidator,
	Form,
	minLengthValidator,
	requiredValidator,
	rollNumberValidator,
	TextInput,
	VStack,
	Flex
} from "@shaastra/ui";
import { When, If, Then, Else } from "react-if";
import { Link } from "react-router-dom";

export default function SignUpPage() {
	const { mutateAsync, data, isLoading, isError } = useSignupMutation();

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
							initialValue={ { name: "", email: "", rollNumber: "", password: "" } }
							onSubmit={ ( { rollNumber: username, ...data } ) => mutateAsync( { ...data, username } ) }
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
								)
							} }
							validations={ {
								name: [ requiredValidator( "Name is Required!" ) ],
								email: [ emailValidator( "Invalid Email" ) ],
								rollNumber: [ rollNumberValidator( "Invalid Roll Number!" ) ],
								password: [ minLengthValidator( 8, "Password too Short!" ) ]
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
