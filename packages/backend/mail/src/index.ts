export class Mailer {
	// private readonly _sender = { name: "Shaastra Prime", email: "prime@shaastra.org" };

	constructor( _apiKey: string, _apiSecret: string ) {
		// mailjet.apiConnect( apiKey, apiSecret );
	}

	async sendMail( _data: { email: string, name: string, subject: string, content: string } ) {
		// Send Mail
		// await mailjet.post( "send", { version: "v3.1" } ).request( {
		// 	Messages: [
		// 		{
		// 			From: {
		// 				Email: this.sender.email,
		// 				Name: this.sender.name
		// 			},
		// 			To: [ { Email: data.email, Name: data.name } ],
		// 			Subject: data.subject,
		// 			TextPart: data.content
		// 		}
		// 	]
		// } );
	}
}