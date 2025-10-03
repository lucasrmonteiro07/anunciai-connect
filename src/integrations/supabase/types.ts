export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          crie_member: boolean | null
          email: string | null
          first_name: string | null
          id: string
          is_vip: boolean | null
          last_name: string | null
          marketing_consent: boolean | null
          subscription_end: string | null
          subscription_start: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crie_member?: boolean | null
          email?: string | null
          first_name?: string | null
          id: string
          is_vip?: boolean | null
          last_name?: string | null
          marketing_consent?: boolean | null
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crie_member?: boolean | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_vip?: boolean | null
          last_name?: string | null
          marketing_consent?: boolean | null
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          service_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          service_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          service_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          address: string | null
          brand: string | null
          category: string
          cep: string | null
          city: string
          condition: string | null
          created_at: string | null
          delivery_available: boolean | null
          denomination: string | null
          description: string | null
          email: string | null
          facebook: string | null
          id: string
          images: string[] | null
          instagram: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          model: string | null
          neighborhood: string | null
          number: string | null
          owner_name: string | null
          phone: string | null
          price: number | null
          product_type: string | null
          status: string | null
          stock_quantity: number | null
          title: string
          type: string
          uf: string
          updated_at: string | null
          user_id: string
          valor: string | null
          warranty_months: number | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          brand?: string | null
          category: string
          cep?: string | null
          city: string
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          denomination?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          images?: string[] | null
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          model?: string | null
          neighborhood?: string | null
          number?: string | null
          owner_name?: string | null
          phone?: string | null
          price?: number | null
          product_type?: string | null
          status?: string | null
          stock_quantity?: number | null
          title: string
          type: string
          uf: string
          updated_at?: string | null
          user_id: string
          valor?: string | null
          warranty_months?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          brand?: string | null
          category?: string
          cep?: string | null
          city?: string
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          denomination?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          images?: string[] | null
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          model?: string | null
          neighborhood?: string | null
          number?: string | null
          owner_name?: string | null
          phone?: string | null
          price?: number | null
          product_type?: string | null
          status?: string | null
          stock_quantity?: number | null
          title?: string
          type?: string
          uf?: string
          updated_at?: string | null
          user_id?: string
          valor?: string | null
          warranty_months?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      services_public: {
        Row: {
          address: string | null
          brand: string | null
          category: string
          cep: string | null
          city: string
          condition: string | null
          created_at: string | null
          delivery_available: boolean | null
          denomination: string | null
          description: string | null
          email: string | null
          facebook: string | null
          id: string
          images: string[] | null
          instagram: string | null
          is_vip: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          model: string | null
          neighborhood: string | null
          number: string | null
          phone: string | null
          price: number | null
          product_type: string | null
          status: string | null
          stock_quantity: number | null
          title: string
          type: string
          uf: string
          updated_at: string | null
          user_id: string | null
          valor: string | null
          warranty_months: number | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          brand?: string | null
          category: string
          cep?: string | null
          city: string
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          denomination?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id: string
          images?: string[] | null
          instagram?: string | null
          is_vip?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          model?: string | null
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          price?: number | null
          product_type?: string | null
          status?: string | null
          stock_quantity?: number | null
          title: string
          type: string
          uf: string
          updated_at?: string | null
          user_id?: string | null
          valor?: string | null
          warranty_months?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          brand?: string | null
          category?: string
          cep?: string | null
          city?: string
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          denomination?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          images?: string[] | null
          instagram?: string | null
          is_vip?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          model?: string | null
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          price?: number | null
          product_type?: string | null
          status?: string | null
          stock_quantity?: number | null
          title?: string
          type?: string
          uf?: string
          updated_at?: string | null
          user_id?: string | null
          valor?: string | null
          warranty_months?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      services_public_safe: {
        Row: {
          brand: string | null
          category: string | null
          cep: string | null
          city: string | null
          condition: string | null
          created_at: string | null
          delivery_available: boolean | null
          denomination: string | null
          description: string | null
          facebook: string | null
          id: string | null
          images: string[] | null
          instagram: string | null
          is_vip: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          model: string | null
          neighborhood: string | null
          price: number | null
          product_type: string | null
          status: string | null
          stock_quantity: number | null
          title: string | null
          type: string | null
          uf: string | null
          updated_at: string | null
          user_id: string | null
          valor: string | null
          warranty_months: number | null
          website: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          cep?: string | null
          city?: string | null
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          denomination?: string | null
          description?: string | null
          facebook?: string | null
          id?: string | null
          images?: string[] | null
          instagram?: string | null
          is_vip?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          model?: string | null
          neighborhood?: string | null
          price?: number | null
          product_type?: string | null
          status?: string | null
          stock_quantity?: number | null
          title?: string | null
          type?: string | null
          uf?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor?: string | null
          warranty_months?: number | null
          website?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          cep?: string | null
          city?: string | null
          condition?: string | null
          created_at?: string | null
          delivery_available?: boolean | null
          denomination?: string | null
          description?: string | null
          facebook?: string | null
          id?: string | null
          images?: string[] | null
          instagram?: string | null
          is_vip?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          model?: string | null
          neighborhood?: string | null
          price?: number | null
          product_type?: string | null
          status?: string | null
          stock_quantity?: number | null
          title?: string | null
          type?: string | null
          uf?: string | null
          updated_at?: string | null
          user_id?: string | null
          valor?: string | null
          warranty_months?: number | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_service_contact_info: {
        Args: { service_id: string }
        Returns: {
          email: string
          owner_name: string
          phone: string
          whatsapp: string
        }[]
      }
      has_role: {
        Args: {
          role_name: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_subscription_active: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          action_type: string
          details?: Json
          target_id?: string
          target_type: string
        }
        Returns: undefined
      }
      make_user_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
      remove_duplicate_services: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          removed_count: number
        }[]
      }
      update_service: {
        Args: { service_data: Json; service_id: string; user_id: string }
        Returns: Json
      }
      update_user_vip_status: {
        Args: {
          is_vip: boolean
          subscription_end?: string
          subscription_start?: string
          subscription_tier?: string
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
