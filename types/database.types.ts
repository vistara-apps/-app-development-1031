export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      fanspark_content: {
        Row: {
          id: string
          creator_id: string
          title: string
          content_type: string
          content_data: string
          tier_id: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          content_type: string
          content_data: string
          tier_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          content_type?: string
          content_data?: string
          tier_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fanspark_content_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "fanspark_creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fanspark_content_tier_id_fkey"
            columns: ["tier_id"]
            referencedRelation: "fanspark_tiers"
            referencedColumns: ["id"]
          }
        ]
      }
      fanspark_creators: {
        Row: {
          id: string
          creator_id: string
          farcaster_id: string | null
          base_wallet_address: string
          name: string
          bio: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          farcaster_id?: string | null
          base_wallet_address: string
          name: string
          bio?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          farcaster_id?: string | null
          base_wallet_address?: string
          name?: string
          bio?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      fanspark_fans: {
        Row: {
          id: string
          fan_id: string
          farcaster_id: string | null
          base_wallet_address: string
          name: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fan_id: string
          farcaster_id?: string | null
          base_wallet_address: string
          name?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fan_id?: string
          farcaster_id?: string | null
          base_wallet_address?: string
          name?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      fanspark_notifications: {
        Row: {
          id: string
          user_id: string
          user_type: string
          title: string
          message: string
          is_read: boolean
          notification_type: string
          related_entity_type: string | null
          related_entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_type: string
          title: string
          message: string
          is_read?: boolean
          notification_type: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_type?: string
          title?: string
          message?: string
          is_read?: boolean
          notification_type?: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      fanspark_subscriptions: {
        Row: {
          id: string
          tier_id: string
          fan_id: string
          start_date: string
          end_date: string
          status: string
          auto_renew: boolean
          transaction_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tier_id: string
          fan_id: string
          start_date?: string
          end_date: string
          status?: string
          auto_renew?: boolean
          transaction_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tier_id?: string
          fan_id?: string
          start_date?: string
          end_date?: string
          status?: string
          auto_renew?: boolean
          transaction_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fanspark_subscriptions_fan_id_fkey"
            columns: ["fan_id"]
            referencedRelation: "fanspark_fans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fanspark_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            referencedRelation: "fanspark_tiers"
            referencedColumns: ["id"]
          }
        ]
      }
      fanspark_tiers: {
        Row: {
          id: string
          creator_id: string
          name: string
          description: string | null
          price_monthly_usd: number
          benefits: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          name: string
          description?: string | null
          price_monthly_usd: number
          benefits?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          name?: string
          description?: string | null
          price_monthly_usd?: number
          benefits?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fanspark_tiers_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "fanspark_creators"
            referencedColumns: ["id"]
          }
        ]
      }
      fanspark_tips: {
        Row: {
          id: string
          creator_id: string
          fan_id: string
          amount: number
          currency: string
          transaction_hash: string | null
          status: string
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          fan_id: string
          amount: number
          currency?: string
          transaction_hash?: string | null
          status?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          fan_id?: string
          amount?: number
          currency?: string
          transaction_hash?: string | null
          status?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fanspark_tips_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "fanspark_creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fanspark_tips_fan_id_fkey"
            columns: ["fan_id"]
            referencedRelation: "fanspark_fans"
            referencedColumns: ["id"]
          }
        ]
      }
      fanspark_transactions: {
        Row: {
          id: string
          transaction_hash: string
          from_address: string
          to_address: string
          amount: number
          currency: string
          transaction_type: string
          status: string
          related_entity_type: string | null
          related_entity_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_hash: string
          from_address: string
          to_address: string
          amount: number
          currency?: string
          transaction_type: string
          status?: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_hash?: string
          from_address?: string
          to_address?: string
          amount?: number
          currency?: string
          transaction_type?: string
          status?: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

