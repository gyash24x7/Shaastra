import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const Mailjet = require( "node-mailjet" );

@Injectable()
export class MailService {
	private readonly mailjet: typeof Mailjet;

	constructor( private readonly configService: ConfigService ) {
		this.mailjet = new Mailjet( {
			apiKey: this.configService.getOrThrow<string>( "app.mail.apiKey" ),
			apiSecret: this.configService.getOrThrow<string>( "app.mail.apiSecret" )
		} );
	}

	async sendMail( data: { email: string, name: string, subject: string, content: string } ) {
		await this.mailjet.post( "send", { version: "v3.1" } ).request( {
			Messages: [
				{
					From: {
						Email: this.configService.getOrThrow<string>( "app.mail.sender.email" ),
						Name: this.configService.getOrThrow<string>( "app.mail.sender.name" )
					},
					To: [ { Email: data.email, Name: data.name } ],
					Subject: data.subject,
					TextPart: data.content
				}
			]
		} );
	}
}