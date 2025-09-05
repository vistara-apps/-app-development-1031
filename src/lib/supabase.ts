import { createClient } from '@supabase/supabase-js';
import type { User, LegalGuide, Script, IncidentReport } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  LEGAL_GUIDES: 'legal_guides',
  SCRIPTS: 'scripts',
  INCIDENT_REPORTS: 'incident_reports',
} as const;

// User operations
export const userService = {
  async create(user: Omit<User, 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([{
        ...user,
        user_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async getById(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as User;
  },

  async update(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async delete(userId: string) {
    const { error } = await supabase
      .from(TABLES.USERS)
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },
};

// Legal guides operations
export const legalGuideService = {
  async getByState(state: string, language: 'en' | 'es' = 'en') {
    const { data, error } = await supabase
      .from(TABLES.LEGAL_GUIDES)
      .select('*')
      .eq('state', state.toUpperCase())
      .eq('language', language)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LegalGuide[];
  },

  async getById(guideId: string) {
    const { data, error } = await supabase
      .from(TABLES.LEGAL_GUIDES)
      .select('*')
      .eq('guide_id', guideId)
      .single();

    if (error) throw error;
    return data as LegalGuide;
  },

  async create(guide: Omit<LegalGuide, 'guide_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.LEGAL_GUIDES)
      .insert([{
        ...guide,
        guide_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data as LegalGuide;
  },
};

// Scripts operations
export const scriptService = {
  async getBySituation(state: string, situation: string, language: 'en' | 'es' = 'en') {
    const { data, error } = await supabase
      .from(TABLES.SCRIPTS)
      .select('*')
      .eq('state', state.toUpperCase())
      .eq('situation', situation)
      .eq('language', language)
      .order('order_in_sequence', { ascending: true });

    if (error) throw error;
    return data as Script[];
  },

  async getByState(state: string, language: 'en' | 'es' = 'en') {
    const { data, error } = await supabase
      .from(TABLES.SCRIPTS)
      .select('*')
      .eq('state', state.toUpperCase())
      .eq('language', language)
      .order('situation', { ascending: true })
      .order('order_in_sequence', { ascending: true });

    if (error) throw error;
    return data as Script[];
  },

  async create(script: Omit<Script, 'script_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.SCRIPTS)
      .insert([{
        ...script,
        script_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Script;
  },
};

// Incident reports operations
export const incidentService = {
  async create(report: Omit<IncidentReport, 'report_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLES.INCIDENT_REPORTS)
      .insert([{
        ...report,
        report_id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data as IncidentReport;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.INCIDENT_REPORTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as IncidentReport[];
  },

  async getById(reportId: string) {
    const { data, error } = await supabase
      .from(TABLES.INCIDENT_REPORTS)
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (error) throw error;
    return data as IncidentReport;
  },

  async update(reportId: string, updates: Partial<IncidentReport>) {
    const { data, error } = await supabase
      .from(TABLES.INCIDENT_REPORTS)
      .update(updates)
      .eq('report_id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data as IncidentReport;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('count')
      .limit(1);

    return { success: !error, error: error?.message };
  } catch (err) {
    return { success: false, error: 'Connection failed' };
  }
};
