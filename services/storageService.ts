import { supabase } from './supabaseClient';

export const storageService = {
  // Upload CV file to Supabase Storage
  async uploadCV(file: File, applicantId: string) {
    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are accepted.');
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10 MB limit.');
      }

      const filePath = `applicants/${applicantId}.pdf`;

      const { data, error } = await supabase.storage
        .from('applicant-cvs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      return { path: data?.path, fullPath: filePath };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Get public URL for CV download (public bucket, direct access)
  async getSignedCVUrl(cvPath: string, expiresIn: number = 900) {
    try {
      if (!cvPath) {
        throw new Error('CV path is required');
      }

      // For public buckets, use direct public URL instead of signed URLs
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;

      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured');
      }

      // Format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/applicant-cvs/${cvPath}`;

      return publicUrl;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Delete CV file
  async deleteCV(cvPath: string) {
    try {
      if (!cvPath) {
        throw new Error('CV path is required');
      }

      const { error } = await supabase.storage
        .from('applicant-cvs')
        .remove([cvPath]);

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
};
