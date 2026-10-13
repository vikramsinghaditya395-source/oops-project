package com.voltflow.electricity.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    /**
     * Dispatches a responsive HTML verification email containing the OTP code.
     */
    public boolean sendOtpEmail(String recipientEmail, String otpCode) {
        String htmlContent = buildHtmlEmailTemplate(recipientEmail, otpCode);

        // Check if real SMTP mail sender is configured
        if (mailSender != null && senderEmail != null && !senderEmail.trim().isEmpty()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(senderEmail, "VoltFlow Energy OS");
                helper.setTo(recipientEmail);
                helper.setSubject("⚡ Your VoltFlow Security Login Code: " + otpCode);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                System.out.println("[EmailService] Real SMTP OTP dispatched successfully to: " + maskEmail(recipientEmail));
                return true;
            } catch (Exception e) {
                System.err.println("[EmailService] SMTP delivery failed: " + e.getMessage() + ". Falling back to local test output.");
            }
        }

        // Local development / college demonstration mode log
        System.out.println("==================================================================");
        System.out.println("  [VoltFlow Email Service - Development Simulation]                ");
        System.out.println("  To:        " + recipientEmail);
        System.out.println("  Subject:   Your VoltFlow Security OTP Code");
        System.out.println("  OTP Code:  " + otpCode + " (Valid for 5 minutes)");
        System.out.println("==================================================================");
        return true;
    }

    private String buildHtmlEmailTemplate(String email, String otpCode) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head><meta charset='UTF-8'></head>" +
               "<body style='margin:0;padding:24px;background-color:#F8FAFC;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#0F172A;'>" +
               "  <div style='max-width:540px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 4px 12px rgba(15,23,42,0.05);'>" +
               "    <div style='background-color:#0F172A;padding:24px 32px;text-align:left;'>" +
               "      <div style='display:inline-block;background:#16A34A;padding:6px 12px;border-radius:8px;color:#FFFFFF;font-weight:800;font-size:16px;'>⚡ VoltFlow</div>" +
               "      <span style='color:#94A3B8;font-size:13px;margin-left:10px;'>Powering smarter energy management.</span>" +
               "    </div>" +
               "    <div style='padding:32px;'>" +
               "      <h2 style='margin-top:0;font-size:20px;font-weight:700;color:#0F172A;'>Your Single-Use Verification Code</h2>" +
               "      <p style='font-size:14px;color:#475569;line-height:1.6;'>Hello,</p>" +
               "      <p style='font-size:14px;color:#475569;line-height:1.6;'>You requested to sign in to your VoltFlow Electricity Management account for <strong>" + email + "</strong>. Use the security code below to complete authentication:</p>" +
               "      <div style='margin:28px 0;text-align:center;'>" +
               "        <div style='display:inline-block;letter-spacing:10px;font-size:32px;font-weight:800;color:#16A34A;background:#F0FDF4;border:2px dashed #86EFAC;padding:14px 28px;border-radius:12px;font-family:monospace;'>" + otpCode + "</div>" +
               "      </div>" +
               "      <div style='background:#FEF3C7;border-left:4px solid #F59E0B;padding:12px 16px;border-radius:6px;margin-bottom:24px;'>" +
               "        <p style='margin:0;font-size:12px;color:#92400E;font-weight:600;'>⏱ This security code expires in 5 minutes (single-use only).</p>" +
               "      </div>" +
               "      <p style='font-size:13px;color:#64748B;line-height:1.5;'>Security Warning: Never share this OTP with anyone, including utility staff or grid administrators. If you did not make this request, you can safely ignore this email.</p>" +
               "    </div>" +
               "    <div style='background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0;text-align:center;font-size:11px;color:#94A3B8;'>" +
               "      VoltFlow Electricity Board • Smart Metering Telemetry & OOP Invoicing Engine" +
               "    </div>" +
               "  </div>" +
               "</body>" +
               "</html>";
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String name = parts[0];
        String visible = name.length() > 2 ? name.substring(0, 2) + "***" : name;
        return visible + "@" + parts[1];
    }
}
