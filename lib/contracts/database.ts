export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      ai_invocations: {
        Row: {
          cached: boolean
          created_at: string
          id: string
          input_hash: string
          latency_ms: number
          model: string
          output_hash: string
          prompt_version_id: string
          tenant_id: string
          tokens_in: number
          tokens_out: number
        }
        Insert: {
          cached?: boolean
          created_at?: string
          id?: string
          input_hash: string
          latency_ms: number
          model: string
          output_hash: string
          prompt_version_id: string
          tenant_id: string
          tokens_in: number
          tokens_out: number
        }
        Update: {
          cached?: boolean
          created_at?: string
          id?: string
          input_hash?: string
          latency_ms?: number
          model?: string
          output_hash?: string
          prompt_version_id?: string
          tenant_id?: string
          tokens_in?: number
          tokens_out?: number
        }
        Relationships: [
          {
            foreignKeyName: 'ai_invocations_prompt_version_id_fkey'
            columns: ['prompt_version_id']
            isOneToOne: false
            referencedRelation: 'ai_prompt_versions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ai_invocations_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      ai_prompt_versions: {
        Row: {
          created_at: string
          draft_schema_jsonb: Json | null
          id: string
          output_schema_jsonb: Json
          prompt_id: string
          system_text: string
          user_template: string
          version: number
        }
        Insert: {
          created_at?: string
          draft_schema_jsonb?: Json | null
          id?: string
          output_schema_jsonb: Json
          prompt_id: string
          system_text: string
          user_template: string
          version: number
        }
        Update: {
          created_at?: string
          draft_schema_jsonb?: Json | null
          id?: string
          output_schema_jsonb?: Json
          prompt_id?: string
          system_text?: string
          user_template?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: 'ai_prompt_versions_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'ai_prompts'
            referencedColumns: ['id']
          },
        ]
      }
      ai_prompts: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          latest_version_id: string | null
          model_pinned: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          latest_version_id?: string | null
          model_pinned?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          latest_version_id?: string | null
          model_pinned?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ai_prompts_latest_version_fk'
            columns: ['latest_version_id']
            isOneToOne: false
            referencedRelation: 'ai_prompt_versions'
            referencedColumns: ['id']
          },
        ]
      }
      ai_usage_monthly: {
        Row: {
          cost_currency: string
          tenant_id: string
          total_cost_minor: number
          total_invocations: number
          total_tokens_in: number
          total_tokens_out: number
          updated_at: string
          year_month: string
        }
        Insert: {
          cost_currency?: string
          tenant_id: string
          total_cost_minor?: number
          total_invocations?: number
          total_tokens_in?: number
          total_tokens_out?: number
          updated_at?: string
          year_month: string
        }
        Update: {
          cost_currency?: string
          tenant_id?: string
          total_cost_minor?: number
          total_invocations?: number
          total_tokens_in?: number
          total_tokens_out?: number
          updated_at?: string
          year_month?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ai_usage_monthly_cost_currency_fkey'
            columns: ['cost_currency']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'ai_usage_monthly_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      assessments: {
        Row: {
          ai_invocation_id: string | null
          created_at: string
          deleted_at: string | null
          id: string
          lead_id: string
          model: string
          payload: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          ai_invocation_id?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          lead_id: string
          model: string
          payload: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          ai_invocation_id?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          lead_id?: string
          model?: string
          payload?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assessments_ai_invocation_id_fkey'
            columns: ['ai_invocation_id']
            isOneToOne: false
            referencedRelation: 'ai_invocations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assessments_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assessments_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          default_palette_id: string
          default_vertical: string
          deleted_at: string | null
          host: string
          id: string
          logo_url: string | null
          name: string
          parent_label: string | null
          theme_version: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_palette_id: string
          default_vertical: string
          deleted_at?: string | null
          host: string
          id?: string
          logo_url?: string | null
          name: string
          parent_label?: string | null
          theme_version?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_palette_id?: string
          default_vertical?: string
          deleted_at?: string | null
          host?: string
          id?: string
          logo_url?: string | null
          name?: string
          parent_label?: string | null
          theme_version?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'brands_default_palette_id_fkey'
            columns: ['default_palette_id']
            isOneToOne: false
            referencedRelation: 'palettes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'brands_default_vertical_fkey'
            columns: ['default_vertical']
            isOneToOne: false
            referencedRelation: 'verticals'
            referencedColumns: ['id']
          },
        ]
      }
      capture_forms: {
        Row: {
          created_at: string
          deleted_at: string | null
          display_name: string
          fields: Json
          id: string
          is_active: boolean
          redirect_url: string | null
          slug: string
          source_template_id: string | null
          source_template_version: number | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          display_name: string
          fields: Json
          id?: string
          is_active?: boolean
          redirect_url?: string | null
          slug: string
          source_template_id?: string | null
          source_template_version?: number | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          display_name?: string
          fields?: Json
          id?: string
          is_active?: boolean
          redirect_url?: string | null
          slug?: string
          source_template_id?: string | null
          source_template_version?: number | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'capture_forms_source_template_id_fkey'
            columns: ['source_template_id']
            isOneToOne: false
            referencedRelation: 'form_templates'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'capture_forms_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      capture_submissions: {
        Row: {
          answers: Json
          capture_form_id: string
          created_at: string
          deleted_at: string | null
          id: string
          submitted_at: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          answers: Json
          capture_form_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          submitted_at?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          answers?: Json
          capture_form_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          submitted_at?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'capture_submissions_capture_form_id_fkey'
            columns: ['capture_form_id']
            isOneToOne: false
            referencedRelation: 'capture_forms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'capture_submissions_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      component_schedules: {
        Row: {
          component_id: string
          created_at: string
          day_offset: number | null
          deleted_at: string | null
          id: string
          tenant_id: string
          unlock_at: string | null
          unlock_rule: Json | null
          updated_at: string
        }
        Insert: {
          component_id: string
          created_at?: string
          day_offset?: number | null
          deleted_at?: string | null
          id?: string
          tenant_id: string
          unlock_at?: string | null
          unlock_rule?: Json | null
          updated_at?: string
        }
        Update: {
          component_id?: string
          created_at?: string
          day_offset?: number | null
          deleted_at?: string | null
          id?: string
          tenant_id?: string
          unlock_at?: string | null
          unlock_rule?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'component_schedules_component_id_fkey'
            columns: ['component_id']
            isOneToOne: false
            referencedRelation: 'components'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'component_schedules_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      components: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          kind: string
          module_id: string
          payload: Json
          position: number
          schema_version: number
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          kind: string
          module_id: string
          payload: Json
          position?: number
          schema_version?: number
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          kind?: string
          module_id?: string
          payload?: Json
          position?: number
          schema_version?: number
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'components_module_id_fkey'
            columns: ['module_id']
            isOneToOne: false
            referencedRelation: 'modules'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'components_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      currencies: {
        Row: {
          code: string
          display_name: string
          symbol: string
        }
        Insert: {
          code: string
          display_name: string
          symbol: string
        }
        Update: {
          code?: string
          display_name?: string
          symbol?: string
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string
          deleted_at: string | null
          host: string
          id: string
          is_primary: boolean
          kind: string
          ssl_status: string | null
          tenant_id: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          host: string
          id?: string
          is_primary?: boolean
          kind: string
          ssl_status?: string | null
          tenant_id: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          host?: string
          id?: string
          is_primary?: boolean
          kind?: string
          ssl_status?: string | null
          tenant_id?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'domains_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string
          created_at: string
          deleted_at: string | null
          enabled: boolean
          id: string
          lang: string
          subject: string
          template_key: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          body_html: string
          body_text: string
          created_at?: string
          deleted_at?: string | null
          enabled?: boolean
          id?: string
          lang?: string
          subject: string
          template_key: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          body_html?: string
          body_text?: string
          created_at?: string
          deleted_at?: string | null
          enabled?: boolean
          id?: string
          lang?: string
          subject?: string
          template_key?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'email_templates_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      enrollments: {
        Row: {
          client_user_id: string
          cohort_start_date: string | null
          completed_at: string | null
          created_at: string
          deleted_at: string | null
          id: string
          paused_at: string | null
          payment_id: string | null
          program_id: string
          started_at: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          client_user_id: string
          cohort_start_date?: string | null
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          paused_at?: string | null
          payment_id?: string | null
          program_id: string
          started_at?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          client_user_id?: string
          cohort_start_date?: string | null
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          paused_at?: string | null
          payment_id?: string | null
          program_id?: string
          started_at?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'enrollments_payment_fk'
            columns: ['payment_id']
            isOneToOne: false
            referencedRelation: 'payments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'enrollments_program_id_fkey'
            columns: ['program_id']
            isOneToOne: false
            referencedRelation: 'programs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'enrollments_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      exchange_rates: {
        Row: {
          base: string
          captured_at: string
          quote: string
          rate: number
        }
        Insert: {
          base: string
          captured_at: string
          quote: string
          rate: number
        }
        Update: {
          base?: string
          captured_at?: string
          quote?: string
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: 'exchange_rates_base_fkey'
            columns: ['base']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'exchange_rates_quote_fkey'
            columns: ['quote']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
        ]
      }
      feature_usage: {
        Row: {
          created_at: string
          feature: string
          id: string
          period_end: string
          period_start: string
          tenant_id: string
          updated_at: string
          usage: Json
        }
        Insert: {
          created_at?: string
          feature: string
          id?: string
          period_end?: string
          period_start?: string
          tenant_id: string
          updated_at?: string
          usage?: Json
        }
        Update: {
          created_at?: string
          feature?: string
          id?: string
          period_end?: string
          period_start?: string
          tenant_id?: string
          updated_at?: string
          usage?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'feature_usage_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      fonts: {
        Row: {
          brand_id: string | null
          created_at: string
          deleted_at: string | null
          display_name: string
          family_name: string
          id: string
          is_active: boolean
          is_official: boolean
          provider: string
          slug: string
          sort_order: number
          subsets: string[]
          updated_at: string
          weights: number[]
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name: string
          family_name: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          provider: string
          slug: string
          sort_order?: number
          subsets?: string[]
          updated_at?: string
          weights: number[]
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string
          family_name?: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          provider?: string
          slug?: string
          sort_order?: number
          subsets?: string[]
          updated_at?: string
          weights?: number[]
        }
        Relationships: [
          {
            foreignKeyName: 'fonts_brand_fk'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
        ]
      }
      form_templates: {
        Row: {
          brand_id: string | null
          created_at: string
          created_by_tenant_id: string | null
          deleted_at: string | null
          display_name: string
          fields: Json
          id: string
          is_active: boolean
          is_official: boolean
          schema_version: number
          slug: string
          superseded_by_template_id: string | null
          updated_at: string
          version: number
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          created_by_tenant_id?: string | null
          deleted_at?: string | null
          display_name: string
          fields: Json
          id?: string
          is_active?: boolean
          is_official?: boolean
          schema_version?: number
          slug: string
          superseded_by_template_id?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          created_by_tenant_id?: string | null
          deleted_at?: string | null
          display_name?: string
          fields?: Json
          id?: string
          is_active?: boolean
          is_official?: boolean
          schema_version?: number
          slug?: string
          superseded_by_template_id?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: 'form_templates_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'form_templates_created_by_tenant_id_fkey'
            columns: ['created_by_tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      leads: {
        Row: {
          capture_submission_id: string | null
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          source: string | null
          status: string
          submitted_at: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          capture_submission_id?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          submitted_at?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          capture_submission_id?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          submitted_at?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_capture_submission_id_fkey'
            columns: ['capture_submission_id']
            isOneToOne: false
            referencedRelation: 'capture_submissions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'leads_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_active: boolean
          role: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          role: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          role?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'memberships_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          position: number
          program_id: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          position?: number
          program_id: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          position?: number
          program_id?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'modules_program_id_fkey'
            columns: ['program_id']
            isOneToOne: false
            referencedRelation: 'programs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'modules_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      page_templates: {
        Row: {
          blocks: Json
          brand_id: string | null
          created_at: string
          created_by_tenant_id: string | null
          deleted_at: string | null
          display_name: string
          id: string
          is_active: boolean
          is_official: boolean
          schema_version: number
          slug: string
          superseded_by_template_id: string | null
          updated_at: string
          version: number
        }
        Insert: {
          blocks: Json
          brand_id?: string | null
          created_at?: string
          created_by_tenant_id?: string | null
          deleted_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          schema_version?: number
          slug: string
          superseded_by_template_id?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          blocks?: Json
          brand_id?: string | null
          created_at?: string
          created_by_tenant_id?: string | null
          deleted_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          schema_version?: number
          slug?: string
          superseded_by_template_id?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: 'page_templates_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'page_templates_created_by_tenant_id_fkey'
            columns: ['created_by_tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      page_versions: {
        Row: {
          blocks_snapshot: Json
          created_at: string
          id: string
          page_id: string
          published_at: string
          published_by_user_id: string | null
          tenant_id: string
          version: number
        }
        Insert: {
          blocks_snapshot: Json
          created_at?: string
          id?: string
          page_id: string
          published_at?: string
          published_by_user_id?: string | null
          tenant_id: string
          version: number
        }
        Update: {
          blocks_snapshot?: Json
          created_at?: string
          id?: string
          page_id?: string
          published_at?: string
          published_by_user_id?: string | null
          tenant_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: 'page_versions_page_id_fkey'
            columns: ['page_id']
            isOneToOne: false
            referencedRelation: 'pages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'page_versions_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      pages: {
        Row: {
          blocks: Json
          created_at: string
          deleted_at: string | null
          id: string
          published_at: string | null
          schema_version: number
          slug: string
          source_template_id: string | null
          source_template_version: number | null
          status: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          blocks: Json
          created_at?: string
          deleted_at?: string | null
          id?: string
          published_at?: string | null
          schema_version?: number
          slug: string
          source_template_id?: string | null
          source_template_version?: number | null
          status?: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          created_at?: string
          deleted_at?: string | null
          id?: string
          published_at?: string | null
          schema_version?: number
          slug?: string
          source_template_id?: string | null
          source_template_version?: number | null
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pages_source_template_id_fkey'
            columns: ['source_template_id']
            isOneToOne: false
            referencedRelation: 'page_templates'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pages_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      palettes: {
        Row: {
          brand_id: string | null
          created_at: string
          created_by_tenant_id: string | null
          deleted_at: string | null
          description: string | null
          display_name: string
          extras_oklch: string[]
          hue: number
          id: string
          is_active: boolean
          is_official: boolean
          primary_light_oklch: string | null
          primary_oklch: string
          secondary_oklch: string
          slug: string | null
          sort_order: number
          source_palette_id: string | null
          surfaces_dark: string[]
          surfaces_light: string[]
          tertiary_oklch: string
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          created_by_tenant_id?: string | null
          deleted_at?: string | null
          description?: string | null
          display_name: string
          extras_oklch: string[]
          hue: number
          id?: string
          is_active?: boolean
          is_official?: boolean
          primary_light_oklch?: string | null
          primary_oklch: string
          secondary_oklch: string
          slug?: string | null
          sort_order?: number
          source_palette_id?: string | null
          surfaces_dark: string[]
          surfaces_light: string[]
          tertiary_oklch: string
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          created_by_tenant_id?: string | null
          deleted_at?: string | null
          description?: string | null
          display_name?: string
          extras_oklch?: string[]
          hue?: number
          id?: string
          is_active?: boolean
          is_official?: boolean
          primary_light_oklch?: string | null
          primary_oklch?: string
          secondary_oklch?: string
          slug?: string | null
          sort_order?: number
          source_palette_id?: string | null
          surfaces_dark?: string[]
          surfaces_light?: string[]
          tertiary_oklch?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'palettes_brand_fk'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'palettes_source_palette_id_fkey'
            columns: ['source_palette_id']
            isOneToOne: false
            referencedRelation: 'palettes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'palettes_tenant_fk'
            columns: ['created_by_tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      payments: {
        Row: {
          amount_minor: number
          captured_at: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          enrollment_id: string | null
          external_payment_url: string | null
          gateway: string
          gateway_ref: string | null
          id: string
          kind: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount_minor: number
          captured_at?: string | null
          created_at?: string
          currency: string
          deleted_at?: string | null
          enrollment_id?: string | null
          external_payment_url?: string | null
          gateway: string
          gateway_ref?: string | null
          id?: string
          kind: string
          status: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount_minor?: number
          captured_at?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          enrollment_id?: string | null
          external_payment_url?: string | null
          gateway?: string
          gateway_ref?: string | null
          id?: string
          kind?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_currency_fkey'
            columns: ['currency']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'payments_enrollment_id_fkey'
            columns: ['enrollment_id']
            isOneToOne: false
            referencedRelation: 'enrollments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          currency: string
          features: Json
          id: string
          is_active: boolean
          monthly_amount_minor: number
          name: string
          setup_amount_minor: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          features: Json
          id?: string
          is_active?: boolean
          monthly_amount_minor: number
          name: string
          setup_amount_minor: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          is_active?: boolean
          monthly_amount_minor?: number
          name?: string
          setup_amount_minor?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'plans_currency_fkey'
            columns: ['currency']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          display_name: string | null
          email: string
          id: string
          locale: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          email: string
          id: string
          locale?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      program_templates: {
        Row: {
          brand_id: string | null
          created_at: string
          created_by_tenant_id: string | null
          deleted_at: string | null
          display_name: string
          id: string
          is_active: boolean
          is_official: boolean
          modules: Json
          schema_version: number
          slug: string
          superseded_by_template_id: string | null
          updated_at: string
          version: number
          vertical_id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          created_by_tenant_id?: string | null
          deleted_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          modules: Json
          schema_version?: number
          slug: string
          superseded_by_template_id?: string | null
          updated_at?: string
          version?: number
          vertical_id: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          created_by_tenant_id?: string | null
          deleted_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          modules?: Json
          schema_version?: number
          slug?: string
          superseded_by_template_id?: string | null
          updated_at?: string
          version?: number
          vertical_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'program_templates_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'program_templates_created_by_tenant_id_fkey'
            columns: ['created_by_tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'program_templates_vertical_id_fkey'
            columns: ['vertical_id']
            isOneToOne: false
            referencedRelation: 'verticals'
            referencedColumns: ['id']
          },
        ]
      }
      programs: {
        Row: {
          brand_id: string
          cohort_type: string
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          enrollment_window: Json | null
          id: string
          price_amount_minor: number | null
          price_currency: string | null
          slug: string
          source_template_id: string | null
          source_template_version: number | null
          status: string
          tags: string[]
          tenant_id: string
          title: string
          updated_at: string
          vertical_id: string
        }
        Insert: {
          brand_id: string
          cohort_type: string
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          enrollment_window?: Json | null
          id?: string
          price_amount_minor?: number | null
          price_currency?: string | null
          slug: string
          source_template_id?: string | null
          source_template_version?: number | null
          status?: string
          tags?: string[]
          tenant_id: string
          title: string
          updated_at?: string
          vertical_id: string
        }
        Update: {
          brand_id?: string
          cohort_type?: string
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          enrollment_window?: Json | null
          id?: string
          price_amount_minor?: number | null
          price_currency?: string | null
          slug?: string
          source_template_id?: string | null
          source_template_version?: number | null
          status?: string
          tags?: string[]
          tenant_id?: string
          title?: string
          updated_at?: string
          vertical_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'programs_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'programs_price_currency_fkey'
            columns: ['price_currency']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'programs_source_template_id_fkey'
            columns: ['source_template_id']
            isOneToOne: false
            referencedRelation: 'program_templates'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'programs_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'programs_vertical_id_fkey'
            columns: ['vertical_id']
            isOneToOne: false
            referencedRelation: 'verticals'
            referencedColumns: ['id']
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          deleted_at: string | null
          endpoint: string
          id: string
          p256dh_key: string
          tenant_id: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          deleted_at?: string | null
          endpoint: string
          id?: string
          p256dh_key: string
          tenant_id: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          deleted_at?: string | null
          endpoint?: string
          id?: string
          p256dh_key?: string
          tenant_id?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'push_subscriptions_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      push_templates: {
        Row: {
          body: string
          created_at: string
          deleted_at: string | null
          enabled: boolean
          frequency_cap_minutes: number | null
          id: string
          lang: string
          template_key: string
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          deleted_at?: string | null
          enabled?: boolean
          frequency_cap_minutes?: number | null
          id?: string
          lang?: string
          template_key: string
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          deleted_at?: string | null
          enabled?: boolean
          frequency_cap_minutes?: number | null
          id?: string
          lang?: string
          template_key?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'push_templates_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      shape_presets: {
        Row: {
          brand_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          is_official: boolean
          radius_base: string
          radius_lg: string
          radius_md: string
          radius_sm: string
          radius_xl: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          radius_base: string
          radius_lg: string
          radius_md: string
          radius_sm: string
          radius_xl: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          radius_base?: string
          radius_lg?: string
          radius_md?: string
          radius_sm?: string
          radius_xl?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'shape_presets_brand_fk'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
        ]
      }
      slug_blocklist: {
        Row: {
          reason: string | null
          slug: string
        }
        Insert: {
          reason?: string | null
          slug: string
        }
        Update: {
          reason?: string | null
          slug?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          deleted_at: string | null
          id: string
          monthly_amount_minor: number
          monthly_currency: string
          monthly_grace_period_until: string | null
          package: string
          setup_amount_minor: number
          setup_currency: string
          started_at: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          monthly_amount_minor: number
          monthly_currency: string
          monthly_grace_period_until?: string | null
          package: string
          setup_amount_minor: number
          setup_currency: string
          started_at?: string | null
          status: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          monthly_amount_minor?: number
          monthly_currency?: string
          monthly_grace_period_until?: string | null
          package?: string
          setup_amount_minor?: number
          setup_currency?: string
          started_at?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_monthly_currency_fkey'
            columns: ['monthly_currency']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'subscriptions_setup_currency_fkey'
            columns: ['setup_currency']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'subscriptions_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      tenant_gateway_credentials: {
        Row: {
          created_at: string
          deleted_at: string | null
          encrypted_credentials_id: string
          gateway: string
          id: string
          is_active: boolean
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          encrypted_credentials_id: string
          gateway: string
          id?: string
          is_active?: boolean
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          encrypted_credentials_id?: string
          gateway?: string
          id?: string
          is_active?: boolean
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tenant_gateway_credentials_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      tenant_push_secrets: {
        Row: {
          created_at: string
          tenant_id: string
          updated_at: string
          vapid_private_key: string
        }
        Insert: {
          created_at?: string
          tenant_id: string
          updated_at?: string
          vapid_private_key: string
        }
        Update: {
          created_at?: string
          tenant_id?: string
          updated_at?: string
          vapid_private_key?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tenant_push_secrets_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: true
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      tenants: {
        Row: {
          brand_id: string
          created_at: string
          default_currency: string
          default_locale: string
          default_tz: string
          deleted_at: string | null
          font_id: string
          id: string
          logo_url: string | null
          name: string
          owner_user_id: string | null
          palette_id: string
          pixels: Json
          shape_preset_id: string
          slug: string
          theme_version: number
          updated_at: string
          vapid_public_key: string | null
          vertical: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          default_currency?: string
          default_locale?: string
          default_tz?: string
          deleted_at?: string | null
          font_id?: string
          id?: string
          logo_url?: string | null
          name: string
          owner_user_id?: string | null
          palette_id?: string
          pixels?: Json
          shape_preset_id?: string
          slug: string
          theme_version?: number
          updated_at?: string
          vapid_public_key?: string | null
          vertical: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          default_currency?: string
          default_locale?: string
          default_tz?: string
          deleted_at?: string | null
          font_id?: string
          id?: string
          logo_url?: string | null
          name?: string
          owner_user_id?: string | null
          palette_id?: string
          pixels?: Json
          shape_preset_id?: string
          slug?: string
          theme_version?: number
          updated_at?: string
          vapid_public_key?: string | null
          vertical?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tenants_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tenants_default_currency_fkey'
            columns: ['default_currency']
            isOneToOne: false
            referencedRelation: 'currencies'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'tenants_font_id_fkey'
            columns: ['font_id']
            isOneToOne: false
            referencedRelation: 'fonts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tenants_palette_id_fkey'
            columns: ['palette_id']
            isOneToOne: false
            referencedRelation: 'palettes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tenants_shape_preset_id_fkey'
            columns: ['shape_preset_id']
            isOneToOne: false
            referencedRelation: 'shape_presets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tenants_vertical_fkey'
            columns: ['vertical']
            isOneToOne: false
            referencedRelation: 'verticals'
            referencedColumns: ['id']
          },
        ]
      }
      vertical_component_kinds: {
        Row: {
          kind: string
          vertical_id: string
        }
        Insert: {
          kind: string
          vertical_id: string
        }
        Update: {
          kind?: string
          vertical_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vertical_component_kinds_vertical_id_fkey'
            columns: ['vertical_id']
            isOneToOne: false
            referencedRelation: 'verticals'
            referencedColumns: ['id']
          },
        ]
      }
      verticals: {
        Row: {
          active: boolean
          created_at: string
          display_name: string
          id: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_name: string
          id: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          display_name?: string
          id?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_use_feature: {
        Args: { p_feature: string; p_tenant_id: string }
        Returns: boolean
      }
      current_tenant_id: { Args: never; Returns: string }
      current_user_role: { Args: never; Returns: string }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      default_font_id: { Args: never; Returns: string }
      default_palette_id: { Args: never; Returns: string }
      default_shape_preset_id: { Args: never; Returns: string }
      get_entitlement: {
        Args: { p_feature: string; p_tenant_id: string }
        Returns: {
          feature_value: Json
          period_end: string
          plan_slug: string
          usage: Json
        }[]
      }
      reset_feature_quota_monthly: { Args: never; Returns: undefined }
      update_feature_quota_usage: {
        Args: { p_delta: number; p_feature: string; p_tenant_id: string }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
