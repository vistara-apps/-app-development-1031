import { supabase } from './supabase';

export type UserRole = 'creator' | 'fan';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  walletAddress: string;
  profileImageUrl: string | null;
  role: UserRole;
}

// Handle user authentication and profile creation/update
export async function handleUserAuth(
  userId: string,
  walletAddress: string,
  email: string | null,
  profileImageUrl: string | null,
  role: UserRole
): Promise<UserProfile | null> {
  try {
    if (role === 'creator') {
      // Check if creator exists
      const { data: existingCreator, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (creatorError && creatorError.code !== 'PGRST116') {
        console.error('Error checking creator:', creatorError);
        return null;
      }
      
      if (existingCreator) {
        // Update existing creator
        const { data: updatedCreator, error: updateError } = await supabase
          .from('creators')
          .update({
            base_wallet_address: walletAddress,
            email: email,
            profile_image_url: profileImageUrl,
          })
          .eq('id', userId)
          .select()
          .single();
        
        if (updateError) {
          console.error('Error updating creator:', updateError);
          return null;
        }
        
        return {
          id: updatedCreator.id,
          name: updatedCreator.name,
          email: updatedCreator.email,
          walletAddress: updatedCreator.base_wallet_address,
          profileImageUrl: updatedCreator.profile_image_url,
          role: 'creator',
        };
      } else {
        // Create new creator
        const { data: newCreator, error: createError } = await supabase
          .from('creators')
          .insert({
            id: userId,
            name: email?.split('@')[0] || 'Creator',
            base_wallet_address: walletAddress,
            email: email,
            profile_image_url: profileImageUrl,
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating creator:', createError);
          return null;
        }
        
        return {
          id: newCreator.id,
          name: newCreator.name,
          email: newCreator.email,
          walletAddress: newCreator.base_wallet_address,
          profileImageUrl: newCreator.profile_image_url,
          role: 'creator',
        };
      }
    } else {
      // Check if fan exists
      const { data: existingFan, error: fanError } = await supabase
        .from('fans')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (fanError && fanError.code !== 'PGRST116') {
        console.error('Error checking fan:', fanError);
        return null;
      }
      
      if (existingFan) {
        // Update existing fan
        const { data: updatedFan, error: updateError } = await supabase
          .from('fans')
          .update({
            base_wallet_address: walletAddress,
            email: email,
            profile_image_url: profileImageUrl,
          })
          .eq('id', userId)
          .select()
          .single();
        
        if (updateError) {
          console.error('Error updating fan:', updateError);
          return null;
        }
        
        return {
          id: updatedFan.id,
          name: updatedFan.name,
          email: updatedFan.email,
          walletAddress: updatedFan.base_wallet_address,
          profileImageUrl: updatedFan.profile_image_url,
          role: 'fan',
        };
      } else {
        // Create new fan
        const { data: newFan, error: createError } = await supabase
          .from('fans')
          .insert({
            id: userId,
            name: email?.split('@')[0] || 'Fan',
            base_wallet_address: walletAddress,
            email: email,
            profile_image_url: profileImageUrl,
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating fan:', createError);
          return null;
        }
        
        return {
          id: newFan.id,
          name: newFan.name,
          email: newFan.email,
          walletAddress: newFan.base_wallet_address,
          profileImageUrl: newFan.profile_image_url,
          role: 'fan',
        };
      }
    }
  } catch (error) {
    console.error('Error in handleUserAuth:', error);
    return null;
  }
}

