import { supabase } from './supabaseClient';

export interface MessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  admin_response: boolean;
  admin_response_to: string | null;
}

export interface ReplyMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  admin_response_to: string;
}

export interface MessageSummary {
  total: number;
  today: number;
  unread: number;
}

export const messageService = {
  /**
   * Get messages with pagination and filtering
   */
  async getMessages(
    limit: number,
    offset: number,
    filters?: {
      search?: string;
      created_from?: string;
      created_to?: string;
      created_on?: string;
      sort?: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'subject_asc' | 'subject_desc';
    }
  ): Promise<{
    messages: MessageRecord[];
    has_more: boolean;
    offset: number;
  }> {
    let query = supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('is_deleted', 0)
      .eq('admin_response', false);

    // Apply date filters
    if (filters?.created_on) {
      const date = new Date(filters.created_on);
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      
      query = query.gte('created_at', start.toISOString()).lte('created_at', end.toISOString());
    } else {
      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from);
      }
      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to);
      }
    }

    if (filters?.search?.trim()) {
      const search = filters.search.trim().replace(/,/g, ' ');
      query = query.or(
        [
          `name.ilike.%${search}%`,
          `email.ilike.%${search}%`,
          `subject.ilike.%${search}%`,
          `message.ilike.%${search}%`
        ].join(',')
      );
    }

    // Apply sorting
    if (filters?.sort) {
      switch (filters.sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true }).order('created_at', { ascending: false });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false }).order('created_at', { ascending: false });
          break;
        case 'subject_asc':
          query = query.order('subject', { ascending: true }).order('created_at', { ascending: false });
          break;
        case 'subject_desc':
          query = query.order('subject', { ascending: false }).order('created_at', { ascending: false });
          break;
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    const messages = (data || []).map((record: any) => ({
      id: String(record.id ?? ''),
      name: String(record.name ?? ''),
      email: String(record.email ?? ''),
      subject: String(record.subject ?? ''),
      message: String(record.message ?? ''),
      created_at: String(record.created_at ?? ''),
      is_read: Boolean(record.is_read ?? false),
      admin_response: Boolean(record.admin_response ?? false),
      admin_response_to: record.admin_response_to ? String(record.admin_response_to) : null
    })) as MessageRecord[];

    return {
      messages,
      has_more: count ? count > offset + limit : false,
      offset: offset + messages.length
    };
  },

  /**
   * Get message summary statistics
   */
  async getMessageSummary(): Promise<MessageSummary> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const { count: total } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', 0)
      .eq('admin_response', false);
    const { count: todayCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', 0)
      .eq('admin_response', false)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());
    
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', 0)
      .eq('admin_response', false)
      .eq('is_read', false);

    return {
      total: total || 0,
      today: todayCount || 0,
      unread: unreadCount || 0
    };
  },

  /**
   * Delete messages by IDs
   */
  async deleteMessages(ids: string[]): Promise<void> {
    if (!ids.length) return;

    const { error } = await supabase.from('messages').update({ is_deleted: 1 }).in('id', ids);

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Delete a single message
   */
  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase.from('messages').update({ is_deleted: 1 }).eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Mark a message as read
   */
  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Create an admin reply message
   */
  async createReplyMessage(input: ReplyMessageInput): Promise<void> {
    const { error } = await supabase.from('messages').insert([
      {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        admin_response: true,
        admin_response_to: input.admin_response_to,
        is_read: true
      }
    ]);

    if (error) {
      throw new Error(error.message);
    }
  }
};
