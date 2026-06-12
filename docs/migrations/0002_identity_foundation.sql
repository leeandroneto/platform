-- Migration 0002 — Identity foundation (retake.run)
-- Party model + 5 camadas auth + JWT hook + RLS dual-read

-- ─── Enums ─────────────────────────────────────────────────────────────────
CREATE TYPE public.party_kind AS ENUM ('person', 'organization');

CREATE TYPE public.party_role_type AS ENUM (
  'tenant',
  'supplier_industry',
  'supplier_distributor',
  'supplier_manufacturer',
  'supplier_nutrition_brand',
  'service_provider',
  'event_organizer',
  'sponsor_platform',
  'sponsor_tenant',
  'sponsor_event'
);

CREATE TYPE public.scope_kind AS ENUM ('platform', 'tenant', 'event');

CREATE TYPE public.party_role_status AS ENUM ('pending', 'active', 'suspended', 'ended');

CREATE TYPE public.party_relationship_kind AS ENUM (
  'brokered_by_platform',
  'sponsorship',
  'b2b_supply',
  'external_partner',
  'internal_partner',
  'space_rental',
  'referral'
);

CREATE TYPE public.tenant_status AS ENUM ('active', 'idle', 'suspended', 'archived');

CREATE TYPE public.membership_role AS ENUM (
  'owner',
  'coach',
  'finance',
  'reception',
  'marketing',
  'athlete',
  'lead'
);

CREATE TYPE public.membership_status AS ENUM ('invited', 'active', 'suspended', 'left');

CREATE TYPE public.domain_mode AS ENUM ('path', 'subdomain', 'cname');
CREATE TYPE public.domain_status AS ENUM ('pending', 'verifying', 'active', 'error');

-- ─── public.parties ────────────────────────────────────────────────────────
CREATE TABLE public.parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.party_kind NOT NULL,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  legal_name text,
  document text,
  country char(2) NOT NULL DEFAULT 'BR',
  preferred_currency char(3) NOT NULL DEFAULT 'BRL',
  contacts jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE INDEX parties_auth_user_id_idx ON public.parties(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX parties_document_idx ON public.parties(document) WHERE document IS NOT NULL;

-- ─── public.party_roles ────────────────────────────────────────────────────
CREATE TABLE public.party_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  role_type public.party_role_type NOT NULL,
  scope_kind public.scope_kind NOT NULL,
  scope_id uuid,
  begin_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status public.party_role_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX party_roles_party_id_idx ON public.party_roles(party_id);
CREATE INDEX party_roles_role_type_idx ON public.party_roles(role_type);
CREATE INDEX party_roles_status_idx ON public.party_roles(status);

-- ─── public.party_relationships ────────────────────────────────────────────
CREATE TABLE public.party_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_a_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  party_b_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  kind public.party_relationship_kind NOT NULL,
  terms jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.party_role_status NOT NULL DEFAULT 'active',
  platform_fee_cents int,
  begin_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_relationship CHECK (party_a_id <> party_b_id)
);

CREATE INDEX party_relationships_a_idx ON public.party_relationships(party_a_id);
CREATE INDEX party_relationships_b_idx ON public.party_relationships(party_b_id);

-- ─── public.slug_blocklist ─────────────────────────────────────────────────
CREATE TABLE public.slug_blocklist (
  slug text PRIMARY KEY,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.slug_blocklist (slug, reason) VALUES
  ('admin', 'reserved'),
  ('app', 'reserved'),
  ('api', 'reserved'),
  ('auth', 'reserved'),
  ('dashboard', 'reserved'),
  ('docs', 'reserved'),
  ('entrar', 'reserved'),
  ('cadastrar', 'reserved'),
  ('sair', 'reserved'),
  ('patrocinio', 'reserved'),
  ('empresas', 'reserved'),
  ('corredores', 'reserved'),
  ('eventos', 'reserved'),
  ('novidades', 'reserved'),
  ('plataforma', 'reserved'),
  ('staff', 'reserved'),
  ('retake', 'reserved'),
  ('www', 'reserved'),
  ('blog', 'reserved'),
  ('mail', 'reserved'),
  ('email', 'reserved'),
  ('support', 'reserved'),
  ('help', 'reserved');

-- ─── public.tenants (materializado de party_role tenant) ───────────────────
CREATE TABLE public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL UNIQUE REFERENCES public.parties(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  display_label text,
  city text,
  state char(2),
  status public.tenant_status NOT NULL DEFAULT 'active',
  theme_tokens jsonb NOT NULL DEFAULT '{}'::jsonb,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$'),
  CONSTRAINT slug_not_blocked CHECK (NOT EXISTS (SELECT 1 FROM public.slug_blocklist WHERE slug_blocklist.slug = tenants.slug))
);

CREATE INDEX tenants_status_idx ON public.tenants(status);

-- ─── public.profiles (perfil de pessoa em contexto) ────────────────────────
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  locale text NOT NULL DEFAULT 'pt-BR',
  a11y_prefs jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX profiles_party_id_idx ON public.profiles(party_id);
CREATE INDEX profiles_auth_user_id_idx ON public.profiles(auth_user_id);

-- ─── public.groups (turmas/níveis pra data scope) ──────────────────────────
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX groups_tenant_id_idx ON public.groups(tenant_id);

-- ─── public.memberships ────────────────────────────────────────────────────
CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  party_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  role public.membership_role NOT NULL,
  position_label text,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  status public.membership_status NOT NULL DEFAULT 'active',
  invited_at timestamptz,
  joined_at timestamptz NOT NULL DEFAULT now(),
  is_public_visible boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, party_id, role)
);

CREATE INDEX memberships_tenant_id_idx ON public.memberships(tenant_id);
CREATE INDEX memberships_party_id_idx ON public.memberships(party_id);
CREATE INDEX memberships_role_idx ON public.memberships(role);
CREATE INDEX memberships_group_id_idx ON public.memberships(group_id) WHERE group_id IS NOT NULL;

-- ─── public.domains ────────────────────────────────────────────────────────
CREATE TABLE public.domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  mode public.domain_mode NOT NULL DEFAULT 'path',
  value text NOT NULL,
  status public.domain_status NOT NULL DEFAULT 'pending',
  verified_at timestamptz,
  dns jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX domains_tenant_id_idx ON public.domains(tenant_id);
CREATE INDEX domains_value_idx ON public.domains(value);

-- ─── public.audit_log ──────────────────────────────────────────────────────
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
  actor_party_id uuid REFERENCES public.parties(id) ON DELETE SET NULL,
  actor_kind text NOT NULL DEFAULT 'user', -- user | ai | system
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_tenant_id_idx ON public.audit_log(tenant_id);
CREATE INDEX audit_log_resource_idx ON public.audit_log(resource_type, resource_id);
CREATE INDEX audit_log_created_at_idx ON public.audit_log(created_at DESC);

-- ─── JWT hook — injeta tenant_id + role + party_id no JWT ──────────────────
-- Chamado por Supabase Auth pré-issue do token (via custom_access_token_hook)
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  claims jsonb;
  v_user_id uuid;
  v_party_id uuid;
  v_active_tenant_id uuid;
  v_active_role text;
BEGIN
  claims := event->'claims';
  v_user_id := (event->>'user_id')::uuid;

  SELECT id INTO v_party_id
  FROM public.parties
  WHERE auth_user_id = v_user_id
  LIMIT 1;

  IF v_party_id IS NOT NULL THEN
    -- Pega 1ª membership ativa do user (prioriza owner, depois coach, etc)
    SELECT m.tenant_id, m.role::text
      INTO v_active_tenant_id, v_active_role
    FROM public.memberships m
    WHERE m.party_id = v_party_id
      AND m.status = 'active'
    ORDER BY
      CASE m.role
        WHEN 'owner' THEN 1
        WHEN 'coach' THEN 2
        WHEN 'finance' THEN 3
        WHEN 'reception' THEN 4
        WHEN 'marketing' THEN 5
        WHEN 'athlete' THEN 6
        WHEN 'lead' THEN 7
      END
    LIMIT 1;

    IF claims->'app_metadata' IS NULL THEN
      claims := jsonb_set(claims, '{app_metadata}', '{}'::jsonb);
    END IF;

    claims := jsonb_set(claims, '{app_metadata,party_id}', to_jsonb(v_party_id));
    IF v_active_tenant_id IS NOT NULL THEN
      claims := jsonb_set(claims, '{app_metadata,tenant_id}', to_jsonb(v_active_tenant_id));
      claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(v_active_role));
    END IF;
  END IF;

  RETURN jsonb_build_object('claims', claims);
END;
$$;

-- Grant pra Supabase Auth service role chamar
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated, anon, public;

-- ─── Trigger: assert_tenant_match em FKs cross-table ───────────────────────
CREATE OR REPLACE FUNCTION public.assert_tenant_match()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Implementação JIT por feature — placeholder
  RETURN NEW;
END;
$$;

-- ─── Updated_at trigger genérico ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER parties_updated_at BEFORE UPDATE ON public.parties FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER party_roles_updated_at BEFORE UPDATE ON public.party_roles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER party_relationships_updated_at BEFORE UPDATE ON public.party_relationships FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER memberships_updated_at BEFORE UPDATE ON public.memberships FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER domains_updated_at BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ─── RLS Enable em todas ───────────────────────────────────────────────────
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_blocklist ENABLE ROW LEVEL SECURITY;

-- ─── Policies básicas (JWT dual-read — fallback pra auth.uid()) ────────────
-- parties: user vê própria party
CREATE POLICY parties_own ON public.parties
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- profiles: user vê próprio profile
CREATE POLICY profiles_own ON public.profiles
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- tenants: filter por tenant_id no JWT ou por memberships do user
CREATE POLICY tenants_via_membership ON public.tenants
  FOR SELECT TO authenticated
  USING (
    id = ((auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
    OR EXISTS (
      SELECT 1 FROM public.memberships m
      JOIN public.parties p ON p.id = m.party_id
      WHERE m.tenant_id = tenants.id
        AND p.auth_user_id = auth.uid()
        AND m.status = 'active'
    )
  );

-- memberships: user vê suas memberships
CREATE POLICY memberships_own ON public.memberships
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parties p
      WHERE p.id = memberships.party_id
        AND p.auth_user_id = auth.uid()
    )
    OR tenant_id = ((auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
  );

-- groups: tenant_id no JWT
CREATE POLICY groups_tenant ON public.groups
  FOR ALL TO authenticated
  USING (tenant_id = ((auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid));

-- domains: tenant_id no JWT
CREATE POLICY domains_tenant ON public.domains
  FOR ALL TO authenticated
  USING (tenant_id = ((auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid));

-- audit_log: tenant_id no JWT (read-only — escrita via SECDEF RPC)
CREATE POLICY audit_log_tenant_read ON public.audit_log
  FOR SELECT TO authenticated
  USING (tenant_id = ((auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid));

-- slug_blocklist: read-only pra todos autenticados (público de fato)
CREATE POLICY slug_blocklist_read ON public.slug_blocklist
  FOR SELECT TO authenticated
  USING (true);

-- party_roles: ver own + tenants where active membership
CREATE POLICY party_roles_own_or_tenant ON public.party_roles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parties p
      WHERE p.id = party_roles.party_id
        AND p.auth_user_id = auth.uid()
    )
  );

-- party_relationships: ver onde sua party é a/b
CREATE POLICY party_relationships_own ON public.party_relationships
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parties p
      WHERE (p.id = party_relationships.party_a_id OR p.id = party_relationships.party_b_id)
        AND p.auth_user_id = auth.uid()
    )
  );

-- ─── Grants: revoke padrão pra anon ────────────────────────────────────────
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT ON public.slug_blocklist TO anon;
