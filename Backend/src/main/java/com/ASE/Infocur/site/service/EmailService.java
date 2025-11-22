package com.ASE.Infocur.site.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.hibernate.validator.internal.constraintvalidators.bv.EmailValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;


    public void sendDriveLinkEmail(String toEmail,String clientName,String dLink){
        Email from=new Email("yushanhettiarachchi639@gmail.com");
        String subject = "Drive Link";
        Email to= new Email(toEmail);

        System.out.println("emai"+toEmail+"dlink"+dLink);

        String htmlContent = "<h3>Hello " + clientName + ",</h3>"
                + "<p>Your process has been completed successfully. You can access your files using the link below:</p>"
                + "<p>Find your Drive link</p>"
                + "<p>"+dLink+", </P>"
                + "<br/><p>Best Regards,<br/>Infocure Team</p>";

        Content content=new Content("text/html",htmlContent);
        Mail mail=new Mail(from,subject,to,content);

        SendGrid sg=new SendGrid(sendGridApiKey);
        Request request=new Request();

        try{
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println("Email sent with status: " + response.getStatusCode());
        }catch(Exception e){
            throw new RuntimeException(e);
        }

    }

    public void sendEmail(String toEmail, String subject, String body) throws IOException {
        Email from = new Email("yushanhettiarachchi639@gmail.com");
        Email to = new Email(toEmail);
        Content content = new Content("text/html", body);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sg.api(request);
        } catch (IOException ex) {
            throw ex;
        }
    }
}
