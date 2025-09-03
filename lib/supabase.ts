import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Creator functions
export async function getCreatorById(id: string) {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching creator:', error);
    return null;
  }
  
  return data;
}

export async function updateCreator(id: string, updates: any) {
  const { data, error } = await supabase
    .from('creators')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating creator:', error);
    return null;
  }
  
  return data;
}

// Tier functions
export async function getCreatorTiers(creatorId: string) {
  const { data, error } = await supabase
    .from('tiers')
    .select('*')
    .eq('creator_id', creatorId)
    .order('price_monthly_usd', { ascending: true });
  
  if (error) {
    console.error('Error fetching tiers:', error);
    return null;
  }
  
  return data;
}

export async function createTier(tier: any) {
  const { data, error } = await supabase
    .from('tiers')
    .insert(tier)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating tier:', error);
    return null;
  }
  
  return data;
}

export async function updateTier(id: string, updates: any) {
  const { data, error } = await supabase
    .from('tiers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating tier:', error);
    return null;
  }
  
  return data;
}

export async function deleteTier(id: string) {
  const { error } = await supabase
    .from('tiers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting tier:', error);
    return false;
  }
  
  return true;
}

// Content functions
export async function getCreatorContent(creatorId: string) {
  const { data, error } = await supabase
    .from('content')
    .select(`
      *,
      tiers (*)
    `)
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching content:', error);
    return null;
  }
  
  return data;
}

export async function createContent(content: any) {
  const { data, error } = await supabase
    .from('content')
    .insert(content)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating content:', error);
    return null;
  }
  
  return data;
}

export async function updateContent(id: string, updates: any) {
  const { data, error } = await supabase
    .from('content')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating content:', error);
    return null;
  }
  
  return data;
}

export async function deleteContent(id: string) {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting content:', error);
    return false;
  }
  
  return true;
}

// Tip functions
export async function createTip(tip: any) {
  const { data, error } = await supabase
    .from('tips')
    .insert(tip)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating tip:', error);
    return null;
  }
  
  return data;
}

export async function getCreatorTips(creatorId: string) {
  const { data, error } = await supabase
    .from('tips')
    .select(`
      *,
      fans (id, name, profile_image_url)
    `)
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tips:', error);
    return null;
  }
  
  return data;
}

// Subscription functions
export async function createSubscription(subscription: any) {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(subscription)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating subscription:', error);
    return null;
  }
  
  return data;
}

export async function getCreatorSubscriptions(creatorId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      fans (id, name, profile_image_url),
      tiers (id, name, price_monthly_usd)
    `)
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching subscriptions:', error);
    return null;
  }
  
  return data;
}

// Transaction functions
export async function createTransaction(transaction: any) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
  
  return data;
}

