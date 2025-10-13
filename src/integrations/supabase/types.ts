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
      admin_audit_logs: {
        Row: {
          accessed_columns: string[] | null
          action_type: string
          additional_metadata: Json | null
          admin_user_id: string
          created_at: string
          id: string
          ip_address: unknown | null
          target_table: string
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          accessed_columns?: string[] | null
          action_type: string
          additional_metadata?: Json | null
          admin_user_id: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          target_table: string
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          accessed_columns?: string[] | null
          action_type?: string
          additional_metadata?: Json | null
          admin_user_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          target_table?: string
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      feature_section: {
        Row: {
          created_at: string
          cta_buttons: Json | null
          feature1: string | null
          feature2: string | null
          id: string
          image1_url: string | null
          image2_url: string | null
          image3_url: string | null
          image4_url: string | null
          is_active: boolean
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_buttons?: Json | null
          feature1?: string | null
          feature2?: string | null
          id?: string
          image1_url?: string | null
          image2_url?: string | null
          image3_url?: string | null
          image4_url?: string | null
          is_active?: boolean
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_buttons?: Json | null
          feature1?: string | null
          feature2?: string | null
          id?: string
          image1_url?: string | null
          image2_url?: string | null
          image3_url?: string | null
          image4_url?: string | null
          is_active?: boolean
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          created_at: string
          cta_buttons: Json | null
          cta_text: string | null
          cta_url: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_buttons?: Json | null
          cta_text?: string | null
          cta_url?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_buttons?: Json | null
          cta_text?: string | null
          cta_url?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          customer_details: Json | null
          customer_id: string | null
          delivery_address: Json | null
          delivery_instructions: string | null
          discount_amount: number | null
          estimated_delivery_date: string | null
          id: string
          notes: string | null
          order_items_data: Json | null
          order_number: number
          order_source: string | null
          order_summary: Json | null
          order_type: string | null
          payment_details: Json | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          shipping_charge: number | null
          status: string
          status_history: Json | null
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          customer_details?: Json | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_instructions?: string | null
          discount_amount?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_items_data?: Json | null
          order_number?: number
          order_source?: string | null
          order_summary?: Json | null
          order_type?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_charge?: number | null
          status?: string
          status_history?: Json | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          customer_details?: Json | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_instructions?: string | null
          discount_amount?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_items_data?: Json | null
          order_number?: number
          order_source?: string | null
          order_summary?: Json | null
          order_type?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_charge?: number | null
          status?: string
          status_history?: Json | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          otp_code: string
          phone_number: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          otp_code: string
          phone_number: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          otp_code?: string
          phone_number?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      products: {
        Row: {
          accessories: Json | null
          benefits: Json | null
          category_id: string | null
          color_variety: Json | null
          cost_price: number | null
          created_at: string
          description: string | null
          design_features: Json | null
          feature1: string | null
          feature2: string | null
          features: Json | null
          id: string
          image_url: string | null
          images: Json | null
          is_active: boolean
          name: string
          preview_section: Json | null
          price: number
          promo_card: Json | null
          qa_section: Json | null
          sku: string | null
          slug: string
          specification_titles: Json | null
          stock_quantity: number
          thumbnail: string | null
          updated_at: string
          variants: Json | null
          videos: Json | null
          visual_features: Json | null
        }
        Insert: {
          accessories?: Json | null
          benefits?: Json | null
          category_id?: string | null
          color_variety?: Json | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          design_features?: Json | null
          feature1?: string | null
          feature2?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean
          name: string
          preview_section?: Json | null
          price?: number
          promo_card?: Json | null
          qa_section?: Json | null
          sku?: string | null
          slug: string
          specification_titles?: Json | null
          stock_quantity?: number
          thumbnail?: string | null
          updated_at?: string
          variants?: Json | null
          videos?: Json | null
          visual_features?: Json | null
        }
        Update: {
          accessories?: Json | null
          benefits?: Json | null
          category_id?: string | null
          color_variety?: Json | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          design_features?: Json | null
          feature1?: string | null
          feature2?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean
          name?: string
          preview_section?: Json | null
          price?: number
          promo_card?: Json | null
          qa_section?: Json | null
          sku?: string | null
          slug?: string
          specification_titles?: Json | null
          stock_quantity?: number
          thumbnail?: string | null
          updated_at?: string
          variants?: Json | null
          videos?: Json | null
          visual_features?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_matches_id: boolean | null
          address_type: string | null
          apartment_unit: string | null
          avatar_url: string | null
          billing_apartment_unit: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          billing_state_province: string | null
          billing_street_address: string | null
          city: string | null
          consent_given: boolean | null
          country: string | null
          created_at: string
          customer_notes: string | null
          customer_status: string | null
          customer_type: string | null
          date_of_birth: string | null
          document_file_url: string | null
          document_number: string | null
          document_type: string | null
          email: string | null
          email_notifications: boolean | null
          first_name: string | null
          gender: string | null
          id: string
          is_verified: boolean | null
          last_name: string | null
          last_order_date: string | null
          loyalty_points: number | null
          marketing_consent: boolean | null
          newsletter_subscription: boolean | null
          phone: string | null
          postal_code: string | null
          preferred_payment_method: string | null
          sms_notifications: boolean | null
          state_province: string | null
          street_address: string | null
          stripe_customer_id: string | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string
          user_id: string
          verification_date: string | null
        }
        Insert: {
          address_matches_id?: boolean | null
          address_type?: string | null
          apartment_unit?: string | null
          avatar_url?: string | null
          billing_apartment_unit?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state_province?: string | null
          billing_street_address?: string | null
          city?: string | null
          consent_given?: boolean | null
          country?: string | null
          created_at?: string
          customer_notes?: string | null
          customer_status?: string | null
          customer_type?: string | null
          date_of_birth?: string | null
          document_file_url?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          last_order_date?: string | null
          loyalty_points?: number | null
          marketing_consent?: boolean | null
          newsletter_subscription?: boolean | null
          phone?: string | null
          postal_code?: string | null
          preferred_payment_method?: string | null
          sms_notifications?: boolean | null
          state_province?: string | null
          street_address?: string | null
          stripe_customer_id?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
        }
        Update: {
          address_matches_id?: boolean | null
          address_type?: string | null
          apartment_unit?: string | null
          avatar_url?: string | null
          billing_apartment_unit?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state_province?: string | null
          billing_street_address?: string | null
          city?: string | null
          consent_given?: boolean | null
          country?: string | null
          created_at?: string
          customer_notes?: string | null
          customer_status?: string | null
          customer_type?: string | null
          date_of_birth?: string | null
          document_file_url?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          last_order_date?: string | null
          loyalty_points?: number | null
          marketing_consent?: boolean | null
          newsletter_subscription?: boolean | null
          phone?: string | null
          postal_code?: string | null
          preferred_payment_method?: string | null
          sms_notifications?: boolean | null
          state_province?: string | null
          street_address?: string | null
          stripe_customer_id?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          favicon_url: string | null
          header_notification: string | null
          hero_banner_url: string | null
          hero_cta_text: string | null
          hero_cta_url: string | null
          hero_title: string | null
          id: string
          logo_url: string | null
          notification_cta_text: string | null
          notification_cta_url: string | null
          notification_enabled: boolean | null
          notification_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          favicon_url?: string | null
          header_notification?: string | null
          hero_banner_url?: string | null
          hero_cta_text?: string | null
          hero_cta_url?: string | null
          hero_title?: string | null
          id?: string
          logo_url?: string | null
          notification_cta_text?: string | null
          notification_cta_url?: string | null
          notification_enabled?: boolean | null
          notification_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          favicon_url?: string | null
          header_notification?: string | null
          hero_banner_url?: string | null
          hero_cta_text?: string | null
          hero_cta_url?: string | null
          hero_title?: string | null
          id?: string
          logo_url?: string | null
          notification_cta_text?: string | null
          notification_cta_url?: string | null
          notification_enabled?: boolean | null
          notification_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          payment_id: string | null
          payu_response: Json | null
          product_info: string
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          payment_id?: string | null
          payu_response?: Json | null
          product_info: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          payment_id?: string | null
          payu_response?: Json | null
          product_info?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_default_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_customer_profile_admin: {
        Args: { p_customer_id: string }
        Returns: {
          created_at: string
          customer_status: string
          display_name: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          total_orders: number
          total_spent: number
          updated_at: string
          user_id: string
        }[]
      }
      get_customer_sensitive_data: {
        Args: {
          p_customer_id: string
          p_justification: string
          p_requested_fields?: string[]
        }
        Returns: Json
      }
      get_customers_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          city: string
          country: string
          created_at: string
          customer_status: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          total_orders: number
          total_spent: number
          user_id: string
        }[]
      }
      get_public_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          category_id: string
          created_at: string
          description: string
          id: string
          image_url: string
          images: Json
          is_active: boolean
          name: string
          price: number
          sku: string
          slug: string
          stock_quantity: number
          updated_at: string
          variants: Json
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_admin_access: {
        Args: {
          p_accessed_columns?: string[]
          p_action_type: string
          p_target_table?: string
          p_target_user_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "user"
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
      app_role: ["admin", "manager", "user"],
    },
  },
} as const
