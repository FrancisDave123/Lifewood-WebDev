import { supabase } from './supabaseClient';

export interface Applicant {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  gender: string;
  age: number;
  phone_number: string;
  email: string;
  position_applied: string;
  designation_id?: string | null;
  designation_name?: string | null;
  country: string;
  current_address: string;
  school_id?: string | null;
  school_name?: string | null;
  uploaded_cv: boolean;
  cv_path?: string | null;
  status_id?: string | null;
  status_name?: string | null;
  new_applicant_status: boolean;
  created_at: string;
}

export const applicantService = {
  // Get paginated applicants with filters
  async getApplicants(
    limit: number = 20,
    offset: number = 0,
    filters?: {
      created_from?: string;
      created_to?: string;
      created_on?: string;
      designation_id?: string;
      new_only?: boolean;
      sort?: 'newest' | 'oldest' | 'first_name_asc' | 'first_name_desc' | 'last_name_asc' | 'last_name_desc';
    }
  ) {
    try {
      let query = supabase
        .from('applicants')
        .select(
          `*,
          designations(designation_name),
          schools(school_name),
          applicant_statuses(status_name)`,
          { count: 'exact' }
        );

      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from);
      }

      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to);
      }

      if (filters?.created_on) {
        const startOfDay = `${filters.created_on}T00:00:00`;
        const endOfDay = `${filters.created_on}T23:59:59`;
        query = query.gte('created_at', startOfDay).lte('created_at', endOfDay);
      }

      if (filters?.designation_id) {
        query = query.eq('designation_id', filters.designation_id);
      }

      if (filters?.new_only) {
        query = query.eq('new_applicant_status', true);
      }

      // Handle sorting
      if (filters?.sort === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (filters?.sort === 'first_name_asc') {
        query = query.order('first_name', { ascending: true });
      } else if (filters?.sort === 'first_name_desc') {
        query = query.order('first_name', { ascending: false });
      } else if (filters?.sort === 'last_name_asc') {
        query = query.order('last_name', { ascending: true });
      } else if (filters?.sort === 'last_name_desc') {
        query = query.order('last_name', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query.range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        applicants: data || [],
        total: count || 0,
        offset,
        has_more: offset + limit < (count || 0)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Create new applicant
  async createApplicant(applicantData: Partial<Applicant>) {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .insert([applicantData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Update applicant
  async updateApplicant(id: string, updates: Partial<Applicant>) {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Delete applicants
  async deleteApplicants(ids: string[]) {
    try {
      const { error } = await supabase
        .from('applicants')
        .delete()
        .in('id', ids);

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Get applicant summary (counts by status)
  async getApplicantSummary() {
    try {
      // Simple approach - count directly using Supabase aggregation
      const { data: allApplicants, error } = await supabase
        .from('applicants')
        .select('status_id', { count: 'exact' });

      if (error) throw error;

      const summary: Record<string, number> = {
        pending: 0,
        hired: 0,
        rejected: 0
      };

      // Get all unique status IDs and map them
      const statusIds = new Set<string>();
      for (const app of allApplicants || []) {
        if (app.status_id) statusIds.add(app.status_id);
      }

      // Fetch status names for all status IDs at once
      if (statusIds.size > 0) {
        const { data: statuses } = await supabase
          .from('applicant_statuses')
          .select('id, status_name')
          .in('id', Array.from(statusIds));

        const statusMap: Record<string, string> = {};
        for (const status of statuses || []) {
          statusMap[status.id] = status.status_name?.toLowerCase() || 'unknown';
        }

        // Count applicants by status
        for (const app of allApplicants || []) {
          if (app.status_id && statusMap[app.status_id]) {
            const key = statusMap[app.status_id];
            summary[key] = (summary[key] || 0) + 1;
          }
        }
      }

      return summary;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Get schools list
  async getSchools() {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, school_name')
        .order('school_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Get designations list
  async getDesignations() {
    try {
      const { data, error } = await supabase
        .from('designations')
        .select('id, designation_name')
        .order('designation_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Check for duplicate email or phone
  async checkDuplicateContact(email: string, phoneNumber: string) {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .select('id')
        .or(`email.eq.${email},phone_number.eq.${phoneNumber}`);

      if (error) throw error;

      const applicants = data || [];
      return {
        exists: applicants.length > 0,
        duplicateEmail: applicants.some((a: any) => a.email === email),
        duplicatePhone: applicants.some((a: any) => a.phone_number === phoneNumber)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
};
