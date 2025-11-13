Paste this into dbdiagram.io to see the diagram of the database:

//////////////////////////////////////////////////
// CarbonFighters Database Schema (dbdiagram.io)
//////////////////////////////////////////////////

Table users {
  id integer [pk, increment]
  firstName text [not null]
  lastName text [not null]
  cpf text [unique, not null]
  email text [unique]
  phone text
  birthday text
  password text [not null]
  created_at datetime [default: `CURRENT_TIMESTAMP`]
}

Table groups {
  id integer [pk, increment]
  name text [not null]
  owner_id integer [not null]
  invite_code text [unique, not null]
  created_at datetime [default: `CURRENT_TIMESTAMP`]
}

Table group_members {
  user_id integer [not null]
  group_id integer [not null]
  joined_at datetime [default: `CURRENT_TIMESTAMP`]
  indexes {
    (user_id, group_id) [pk]
  }
}

//////////////////////////////////////////////////
// Relationships
//////////////////////////////////////////////////

Ref: groups.owner_id > users.id
Ref: group_members.user_id > users.id
Ref: group_members.group_id > groups.id
