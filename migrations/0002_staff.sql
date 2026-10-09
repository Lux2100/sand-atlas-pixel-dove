-- Staff allowlist and access log. Director is the DIRECTOR_EMAIL account only.

create table if not exists staff_member (
  email text primary key,
  name text not null default '',
  role text not null,
  status text not null default 'active',
  user_id text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  constraint staff_member_role_chk check (role in ('director', 'manager', 'staff')),
  constraint staff_member_status_chk check (status in ('active', 'suspended'))
);

create index if not exists staff_member_user_id_idx on staff_member (user_id);

create table if not exists access_log (
  id text primary key,
  at timestamptz not null default now(),
  actor_email text not null,
  actor_name text not null default '',
  action text not null,
  target_email text,
  detail text not null
);

create index if not exists access_log_at_idx on access_log (at desc);
