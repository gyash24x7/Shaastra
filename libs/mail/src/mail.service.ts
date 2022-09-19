import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Mailjet from "node-mailjet";

@Injectable()
export class MailService {
	private readonly mailjet: Mailjet;

	constructor( private readonly configService: ConfigService ) {
		this.mailjet = new Mailjet( {
			apiKey: this.configService.getOrThrow<string>( "app.mail.apiKey" ),
			apiSecret: this.configService.getOrThrow<string>( "app.mail.apiSecret" )
		} )
	}

	sendMail() {
		this.mailjet.post( "send", { version: "v3.1" } ).request( {
			Messages: [
				{
					From: {
						Email: this.configService.getOrThrow<string>( "app.mail.sender.email" ),
						Name: this.configService.getOrThrow<string>( "app.mail.sender.name" )
					}
				}
			]
		} )
	}
}