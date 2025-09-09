// Database types generated from Supabase schema
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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'admin' | 'investor' | 'agent' | 'client' | 'viewer'
          company_name: string | null
          license_number: string | null
          bio: string | null
          address: Json | null
          preferences: Json
          metadata: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'admin' | 'investor' | 'agent' | 'client' | 'viewer'
          company_name?: string | null
          license_number?: string | null
          bio?: string | null
          address?: Json | null
          preferences?: Json
          metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'admin' | 'investor' | 'agent' | 'client' | 'viewer'
          company_name?: string | null
          license_number?: string | null
          bio?: string | null
          address?: Json | null
          preferences?: Json
          metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string | null
          property_type: 'residential' | 'commercial' | 'industrial' | 'land' | 'mixed_use'
          status: 'available' | 'under_contract' | 'sold' | 'rented' | 'maintenance'
          address: Json
          location: unknown | null
          price: number | null
          rental_price: number | null
          size_sqft: number | null
          bedrooms: number | null
          bathrooms: number | null
          year_built: number | null
          lot_size: number | null
          features: Json
          amenities: string[] | null
          images: Json
          virtual_tour_url: string | null
          owner_id: string | null
          agent_id: string | null
          listing_date: string
          metadata: Json
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          property_type: 'residential' | 'commercial' | 'industrial' | 'land' | 'mixed_use'
          status?: 'available' | 'under_contract' | 'sold' | 'rented' | 'maintenance'
          address: Json
          location?: unknown | null
          price?: number | null
          rental_price?: number | null
          size_sqft?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          year_built?: number | null
          lot_size?: number | null
          features?: Json
          amenities?: string[] | null
          images?: Json
          virtual_tour_url?: string | null
          owner_id?: string | null
          agent_id?: string | null
          listing_date?: string
          metadata?: Json
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          property_type?: 'residential' | 'commercial' | 'industrial' | 'land' | 'mixed_use'
          status?: 'available' | 'under_contract' | 'sold' | 'rented' | 'maintenance'
          address?: Json
          location?: unknown | null
          price?: number | null
          rental_price?: number | null
          size_sqft?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          year_built?: number | null
          lot_size?: number | null
          features?: Json
          amenities?: string[] | null
          images?: Json
          virtual_tour_url?: string | null
          owner_id?: string | null
          agent_id?: string | null
          listing_date?: string
          metadata?: Json
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      property_analytics: {
        Row: {
          id: string
          property_id: string
          views_count: number
          inquiries_count: number
          favorites_count: number
          shares_count: number
          average_time_on_page: number | null
          conversion_rate: number | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          views_count?: number
          inquiries_count?: number
          favorites_count?: number
          shares_count?: number
          average_time_on_page?: number | null
          conversion_rate?: number | null
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          views_count?: number
          inquiries_count?: number
          favorites_count?: number
          shares_count?: number
          average_time_on_page?: number | null
          conversion_rate?: number | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          notes?: string | null
          created_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string
          user_id: string
          agent_id: string | null
          message: string
          phone: string | null
          email: string | null
          preferred_contact_method: string | null
          status: string
          response: string | null
          responded_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          agent_id?: string | null
          message: string
          phone?: string | null
          email?: string | null
          preferred_contact_method?: string | null
          status?: string
          response?: string | null
          responded_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          agent_id?: string | null
          message?: string
          phone?: string | null
          email?: string | null
          preferred_contact_method?: string | null
          status?: string
          response?: string | null
          responded_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          property_id: string | null
          buyer_id: string | null
          seller_id: string | null
          agent_id: string | null
          transaction_type: 'purchase' | 'sale' | 'rental' | 'lease'
          amount: number
          commission_amount: number | null
          closing_date: string | null
          status: string
          contract_url: string | null
          notes: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          buyer_id?: string | null
          seller_id?: string | null
          agent_id?: string | null
          transaction_type: 'purchase' | 'sale' | 'rental' | 'lease'
          amount: number
          commission_amount?: number | null
          closing_date?: string | null
          status?: string
          contract_url?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          buyer_id?: string | null
          seller_id?: string | null
          agent_id?: string | null
          transaction_type?: 'purchase' | 'sale' | 'rental' | 'lease'
          amount?: number
          commission_amount?: number | null
          closing_date?: string | null
          status?: string
          contract_url?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          property_id: string
          transaction_id: string | null
          uploaded_by: string | null
          document_type: 'contract' | 'deed' | 'inspection' | 'financial' | 'legal' | 'other'
          title: string
          description: string | null
          file_url: string
          file_size: number | null
          mime_type: string | null
          is_public: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          transaction_id?: string | null
          uploaded_by?: string | null
          document_type: 'contract' | 'deed' | 'inspection' | 'financial' | 'legal' | 'other'
          title: string
          description?: string | null
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          is_public?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          transaction_id?: string | null
          uploaded_by?: string | null
          document_type?: 'contract' | 'deed' | 'inspection' | 'financial' | 'legal' | 'other'
          title?: string
          description?: string | null
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          is_public?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          property_id: string
          user_id: string
          agent_id: string | null
          appointment_date: string
          duration_minutes: number
          type: string
          status: string
          notes: string | null
          meeting_url: string | null
          reminder_sent: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          agent_id?: string | null
          appointment_date: string
          duration_minutes?: number
          type?: string
          status?: string
          notes?: string | null
          meeting_url?: string | null
          reminder_sent?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          agent_id?: string | null
          appointment_date?: string
          duration_minutes?: number
          type?: string
          status?: string
          notes?: string | null
          meeting_url?: string | null
          reminder_sent?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          action_url: string | null
          is_read: boolean
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          action_url?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          action_url?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          search_query: Json
          results_count: number | null
          clicked_results: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          search_query: Json
          results_count?: number | null
          clicked_results?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          search_query?: Json
          results_count?: number | null
          clicked_results?: string[] | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_roi: {
        Args: {
          purchase_price: number
          rental_income: number
          expenses?: number
        }
        Returns: number
      }
      get_property_recommendations: {
        Args: {
          user_uuid: string
          limit_count?: number
        }
        Returns: Array<{
          property_id: string
          score: number
        }>
      }
      increment_property_view: {
        Args: {
          property_uuid: string
        }
        Returns: void
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_agent: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      search_properties_nearby: {
        Args: {
          lat: number
          lng: number
          radius_km?: number
        }
        Returns: Array<{
          property_id: string
          distance_km: number
        }>
      }
    }
    Enums: {
      user_role: 'admin' | 'investor' | 'agent' | 'client' | 'viewer'
      property_status: 'available' | 'under_contract' | 'sold' | 'rented' | 'maintenance'
      property_type: 'residential' | 'commercial' | 'industrial' | 'land' | 'mixed_use'
      transaction_type: 'purchase' | 'sale' | 'rental' | 'lease'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      document_type: 'contract' | 'deed' | 'inspection' | 'financial' | 'legal' | 'other'
    }
  }
}
