import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_HIRED = import.meta.env.VITE_EMAILJS_TEMPLATE_HIRED || '';
const TEMPLATE_REJECTED = import.meta.env.VITE_EMAILJS_TEMPLATE_REJECTED || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const AI_SERVICE_ID = import.meta.env.VITE_EMAILJS_AI_SERVICE_ID || '';
const AI_TEMPLATE = import.meta.env.VITE_EMAILJS_AI_TEMPLATE || '';
const AI_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_AI_PUBLIC_KEY || '';
const AI_ADMIN_RESPONSE_TEMPLATE = import.meta.env.VITE_EMAILJS_AI_ADMIN_RESPONSE_TEMPLATE || '';

// Note: EmailJS initialization will be handled per service to avoid conflicts

export const emailService = {
  /**
   * Send a congratulations email to a hired applicant
   * @param applicantEmail - Email address of the applicant
   * @param applicantName - Full name of the applicant
   * @param position - Position applied for
   */
  async sendHiredEmail(
    applicantEmail: string,
    applicantName: string,
    position: string
  ): Promise<string> {
    try {
      if (!SERVICE_ID || !TEMPLATE_HIRED || !PUBLIC_KEY) {
        throw new Error('EmailJS configuration is incomplete. Please check your environment variables.');
      }

      console.log('EmailJS Config Check:', {
        SERVICE_ID: SERVICE_ID ? 'Set' : 'Missing',
        TEMPLATE_HIRED: TEMPLATE_HIRED ? 'Set' : 'Missing',
        PUBLIC_KEY: PUBLIC_KEY ? 'Set' : 'Missing'
      });

      // Initialize EmailJS for regular emails
      if (PUBLIC_KEY) {
        emailjs.init(PUBLIC_KEY);
      }

      console.log('Sending hired email with:', {
        to_email: applicantEmail,
        to_name: applicantName,
        position: position
      });

      const result = await emailjs.send(SERVICE_ID, TEMPLATE_HIRED, {
        to_email: applicantEmail,
        to_name: applicantName,
        position: position
      });

      console.log('Email sent successfully:', result);
      return result.status === 200 ? 'success' : 'failed';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send hired email';
      console.error('Error sending hired email:', errorMessage);
      console.error('Full error details:', error);
      throw error;
    }
  },

  /**
   * Send a rejection email to an unsuccessful applicant
   * @param applicantEmail - Email address of the applicant
   * @param applicantName - Full name of the applicant
   * @param position - Position applied for
   */
  async sendRejectedEmail(
    applicantEmail: string,
    applicantName: string,
    position: string
  ): Promise<string> {
    try {
      if (!SERVICE_ID || !TEMPLATE_REJECTED || !PUBLIC_KEY) {
        throw new Error('EmailJS configuration is incomplete. Please check your environment variables.');
      }

      console.log('EmailJS Config Check:', {
        SERVICE_ID: SERVICE_ID ? 'Set' : 'Missing',
        TEMPLATE_REJECTED: TEMPLATE_REJECTED ? 'Set' : 'Missing',
        PUBLIC_KEY: PUBLIC_KEY ? 'Set' : 'Missing'
      });

      // Initialize EmailJS for regular emails
      if (PUBLIC_KEY) {
        emailjs.init(PUBLIC_KEY);
      }

      console.log('Sending rejected email with:', {
        to_email: applicantEmail,
        to_name: applicantName,
        position: position
      });

      const result = await emailjs.send(SERVICE_ID, TEMPLATE_REJECTED, {
        to_email: applicantEmail,
        to_name: applicantName,
        position: position
      });

      console.log('Email sent successfully:', result);
      return result.status === 200 ? 'success' : 'failed';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send rejected email';
      console.error('Error sending rejected email:', errorMessage);
      console.error('Full error details:', error);
      throw error;
    }
  },

  /**
   * Send an AI screening email to an applicant
   * @param applicantEmail - Email address of the applicant
   * @param applicantName - Full name of the applicant
   * @param position - Position applied for
   */
  async sendAIScreeningEmail(
    applicantEmail: string,
    applicantName: string,
    position: string
  ): Promise<string> {
    try {
      if (!AI_SERVICE_ID || !AI_TEMPLATE || !AI_PUBLIC_KEY) {
        throw new Error('AI EmailJS configuration is incomplete. Please check your environment variables.');
      }

      // Initialize AI EmailJS if not already initialized
      if (AI_PUBLIC_KEY) {
        emailjs.init(AI_PUBLIC_KEY);
      }

      console.log('AI EmailJS Config Check:', {
        AI_SERVICE_ID: AI_SERVICE_ID ? 'Set' : 'Missing',
        AI_TEMPLATE: AI_TEMPLATE ? 'Set' : 'Missing',
        AI_PUBLIC_KEY: AI_PUBLIC_KEY ? 'Set' : 'Missing'
      });

      console.log('Sending AI screening email with:', {
        to_email: applicantEmail,
        to_name: applicantName,
        position: position
      });

      const result = await emailjs.send(AI_SERVICE_ID, AI_TEMPLATE, {
        to_email: applicantEmail,
        to_name: applicantName,
        position: position
      });

      console.log('AI Email sent successfully:', result);
      return result.status === 200 ? 'success' : 'failed';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send AI screening email';
      console.error('Error sending AI screening email:', errorMessage);
      console.error('Full error details:', error);
      throw error;
    }
  },

  /**
   * Send an admin response email to a contact inquiry sender
   * @param toEmail - Recipient email address
   * @param replyTo - Reply-to email address
   * @param subject - Email subject
   * @param message - Email message body
   * @param fromName - Admin display name
   * @param fromEmail - Admin sender email
   */
  async sendAdminResponseEmail(
    toEmail: string,
    replyTo: string,
    subject: string,
    message: string,
    fromName: string,
    fromEmail: string
  ): Promise<string> {
    try {
      if (!AI_SERVICE_ID || !AI_ADMIN_RESPONSE_TEMPLATE || !AI_PUBLIC_KEY) {
        throw new Error('Admin response EmailJS configuration is incomplete. Please check your environment variables.');
      }

      if (AI_PUBLIC_KEY) {
        emailjs.init(AI_PUBLIC_KEY);
      }

      console.log('Admin response EmailJS Config Check:', {
        AI_SERVICE_ID: AI_SERVICE_ID ? 'Set' : 'Missing',
        AI_ADMIN_RESPONSE_TEMPLATE: AI_ADMIN_RESPONSE_TEMPLATE ? 'Set' : 'Missing',
        AI_PUBLIC_KEY: AI_PUBLIC_KEY ? 'Set' : 'Missing'
      });

      console.log('Sending admin response email with:', {
        to_email: toEmail,
        reply_to: replyTo,
        subject,
        from_name: fromName,
        from_email: fromEmail
      });

      const result = await emailjs.send(AI_SERVICE_ID, AI_ADMIN_RESPONSE_TEMPLATE, {
        to_email: toEmail,
        reply_to: replyTo,
        subject,
        message,
        from_name: fromName,
        from_email: fromEmail
      });

      console.log('Admin response email sent successfully:', result);
      return result.status === 200 ? 'success' : 'failed';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send admin response email';
      console.error('Error sending admin response email:', errorMessage);
      console.error('Full error details:', error);
      throw error;
    }
  }
};
