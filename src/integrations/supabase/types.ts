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
      admin_users: {
        Row: {
          admin_role: string | null
          created_at: string
          created_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          admin_role?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          admin_role?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      endorsement_applications: {
        Row: {
          additional_certifications: Json | null
          admin_notes: string | null
          annual_revenue_range: string | null
          applicant_id_document_url: string | null
          application_status: string | null
          business_address: string
          business_description: string
          business_goals: string | null
          business_lga: string
          business_name: string
          business_plan_url: string | null
          business_sector: string
          business_state: string
          business_type: string
          cac_document_url: string | null
          created_at: string
          employment_plan: string | null
          expected_impact: string | null
          financial_statements_url: string | null
          funding_requirements: string | null
          id: string
          nnypa_analysis: string | null
          nnypa_score: number | null
          number_of_employees: string | null
          other_documents: Json | null
          registration_number: string | null
          reviewed_at: string | null
          social_media_links: Json | null
          submitted_at: string
          updated_at: string
          user_id: string
          website_url: string | null
          years_in_operation: number | null
        }
        Insert: {
          additional_certifications?: Json | null
          admin_notes?: string | null
          annual_revenue_range?: string | null
          applicant_id_document_url?: string | null
          application_status?: string | null
          business_address: string
          business_description: string
          business_goals?: string | null
          business_lga: string
          business_name: string
          business_plan_url?: string | null
          business_sector: string
          business_state: string
          business_type: string
          cac_document_url?: string | null
          created_at?: string
          employment_plan?: string | null
          expected_impact?: string | null
          financial_statements_url?: string | null
          funding_requirements?: string | null
          id?: string
          nnypa_analysis?: string | null
          nnypa_score?: number | null
          number_of_employees?: string | null
          other_documents?: Json | null
          registration_number?: string | null
          reviewed_at?: string | null
          social_media_links?: Json | null
          submitted_at?: string
          updated_at?: string
          user_id: string
          website_url?: string | null
          years_in_operation?: number | null
        }
        Update: {
          additional_certifications?: Json | null
          admin_notes?: string | null
          annual_revenue_range?: string | null
          applicant_id_document_url?: string | null
          application_status?: string | null
          business_address?: string
          business_description?: string
          business_goals?: string | null
          business_lga?: string
          business_name?: string
          business_plan_url?: string | null
          business_sector?: string
          business_state?: string
          business_type?: string
          cac_document_url?: string | null
          created_at?: string
          employment_plan?: string | null
          expected_impact?: string | null
          financial_statements_url?: string | null
          funding_requirements?: string | null
          id?: string
          nnypa_analysis?: string | null
          nnypa_score?: number | null
          number_of_employees?: string | null
          other_documents?: Json | null
          registration_number?: string | null
          reviewed_at?: string | null
          social_media_links?: Json | null
          submitted_at?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
          years_in_operation?: number | null
        }
        Relationships: []
      }
      nnypadatabase: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          age_range: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          is_diaspora: boolean
          lga: string | null
          national_id_number: string | null
          national_id_type: string | null
          phone_number: string | null
          profile_picture_url: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          age_range?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          id?: string
          is_diaspora?: boolean
          lga?: string | null
          national_id_number?: string | null
          national_id_type?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          age_range?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          is_diaspora?: boolean
          lga?: string | null
          national_id_number?: string | null
          national_id_type?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_file_url: {
        Args: { bucket_name: string; file_path: string }
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
