import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_HIRED = import.meta.env.VITE_EMAILJS_TEMPLATE_HIRED || '';
const TEMPLATE_REJECTED = import.meta.env.VITE_EMAILJS_TEMPLATE_REJECTED || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS
if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

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
  }
};
