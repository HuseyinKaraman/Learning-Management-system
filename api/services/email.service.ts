import ejs from "ejs";
import nodemailer, {Transporter } from "nodemailer";
import path from "path";
import { SMTP_MAIL, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT, SMTP_SERVICE } from "../constants/environment";

interface IEmailOptions {
    email: string;
    subject: string;
    template: string;
    data: {[key: string]: any};
}


const transporter:Transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    service: SMTP_SERVICE,
    auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD
    }
})

export const sendEmail = async (options:IEmailOptions):Promise<void> => {
        const {email,subject,template,data} = options;

        // get the path to the email template file
        const templatePath = path.join(__dirname, "./email-templates", template);

        // Render the HTML template using EJS
        const html:string = await ejs.renderFile(templatePath, data);


        const mailOptions = {
            from: SMTP_MAIL,
            to: email,
            subject,
            html
        }

        await transporter.sendMail(mailOptions);
}

