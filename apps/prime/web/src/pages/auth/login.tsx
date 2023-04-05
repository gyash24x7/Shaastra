import { loginMutationFn } from "@api/client";
import { ExclamationCircleIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";
import { Banner, Button, Flex, Form, minLengthValidator, patternValidator, TextInput, VStack } from "@prime/ui";
import { useMutation } from "@tanstack/react-query";
import { When } from "react-if";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { genqlClient } from "../../utils/client";

export const rollNumberRegex = /^[a-z]{2}[0-9]{2}[a-z][0-9]{3}$/;

export default function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const { mutateAsync, isLoading, isError } = useMutation( {
		mutationFn: loginMutationFn( genqlClient ),
		onSuccess: async () => {
			await login();
			navigate( "/" );
		}
	} );

	return (
		<VStack className={ "h-screen p-8" }>
			<img src={ "/images/DarkLogo.png" } alt={ "Shaastra Logo" } className={ "w-60 h-auto mx-auto my-4" }/>
			<h2 className={ "font-light text-3xl" }>LOGIN</h2>
			<Form
				initialValue={ { rollNumber: "", password: "" } }
				onSubmit={ ( { password, rollNumber } ) => mutateAsync( { username: rollNumber, password } ) }
				submitBtn={ () => {
					return (
						<Button
							appearance={ "primary" }
							type={ "submit" }
							buttonText={ "Submit" }
							fullWidth
							isLoading={ isLoading }
						/>
					);
				} }
				renderMap={ {
					rollNumber: ( { appearance, error, ...props } ) => (
						<TextInput
							{ ...props }
							value={ props.value.toUpperCase() }
							setValue={ v => props.setValue( v.toLowerCase() ) }
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
					rollNumber: [ patternValidator( rollNumberRegex, "Invalid Roll Number!" ) ],
					password: [ minLengthValidator( 7, "Password too Short!" ) ]
				} }
			/>
			<Flex justify={ "space-between" }>
				<span>Don't have an account?</span>
				<span>
					<Link to={ "/auth/signup" }>Signup</Link>
				</span>
			</Flex>
			<When condition={ isError }>
				<Banner
					message={ "Some Error!" }
					appearance={ "danger" }
					renderIcon={ ( props ) => <ExclamationCircleIcon { ...props }/> }
				/>
			</When>
		</VStack>
	);
}
