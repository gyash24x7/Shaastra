import { DevicePhoneMobileIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid/index.js";
import { Department, useCreateMemberMutation } from "@shaastra/client";
import { Flex, VStack, Form, TextInput, ListSelect, Banner } from "@shaastra/ui";
import { useState } from "react";
import { When } from "react-if";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMount } from "react-use";

const departments: Department[] = [
	Department.Envisage,
	Department.Evolve,
	Department.Finance,
	Department.Publicity,
	Department.Qms,
	Department.Webops,
	Department.ConceptAndDesign,
	Department.EventsAndWorkshops,
	Department.OperationsAndInfrastructurePlanning,
	Department.ShowsAndExhibitions,
	Department.SponsorshipAndPr
];

export default function CreateMemberPage() {
	const [ searchParams, setSearchParams ] = useSearchParams();
	const navigate = useNavigate();
	const [ hash ] = useState( searchParams.get( "hash" ) || "" );
	const [ userId ] = useState( searchParams.get( "userId" ) || "" );

	const { mutateAsync, isLoading, isError } = useCreateMemberMutation( {
		onSuccess() {
			navigate( "/auth/login" );
		}
	} );

	useMount( () => {
		if ( !hash || !userId ) {
			navigate( "/auth/login" );
		}
		setSearchParams();
	} );

	return (
		<Flex className={ "h-screen" }>
			<div className={ "flex-grow auth-bg h-screen" }></div>
			<div className={ "w-1/4 border-l-2 border-dark-500 h-screen auth-sidebar" }>
				<VStack className={ "h-screen p-8" }>
					<img
						src={ "/images/DarkLogo.png" }
						alt={ "Shaastra Logo" }
						className={ "w-60 h-auto mx-auto my-4" }
					/>
					<h2 className={ "font-light text-3xl" }>MEMBER DETAILS</h2>
					<h4 className={ "text-lg" }>
						Please Enter the following details
					</h4>
					<Form
						isLoading={ isLoading }
						onSubmit={ ( values ) => mutateAsync( { ...values, userId, hash } ) }
						initialValue={ { department: Department.Webops, mobile: "" } }
						renderMap={ {
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
					/>
					<When condition={ isError }>
						<Banner
							message={ "Some Error!" }
							appearance={ "danger" }
							renderIcon={ ( props ) => <ExclamationCircleIcon { ...props }/> }
						/>
					</When>
				</VStack>
			</div>
		</Flex>
	);
}