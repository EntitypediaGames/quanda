SET client_min_messages TO WARNING;

create sequence answer_id_seq;

create sequence oauth_token_id_seq;

create sequence quanda_user_id_seq;

create sequence question_id_seq;

create sequence version_seq;

alter sequence answer_id_seq owner to quanda;

alter sequence oauth_token_id_seq owner to quanda;

alter sequence quanda_user_id_seq owner to quanda;

alter sequence question_id_seq owner to quanda;

alter sequence version_seq owner to quanda;


/*==============================================================*/
/* Table: answer                                                */
/*==============================================================*/
create table answer (
   id                   int8                 not null default nextval('answer_id_seq'::regclass),
   question_id          int8                 not null,
   answer_time          timestamp            not null,
   answer               varchar(255)         not null,
   constraint PK_ANSWER primary key (id)
)
without oids;

comment on table answer is
'players answers';

comment on column answer.question_id is
'id of the question';

comment on column answer.answer_time is
'answer time';

comment on column answer.answer is
'answer text';

-- set table ownership
alter table answer owner to quanda
;
/*==============================================================*/
/* Table: oauth_token                                           */
/*==============================================================*/
create table oauth_token (
   id                   int8                 not null default nextval('oauth_token_id_seq'::regclass),
   uid                  varchar(255)         not null,
   resource_id          varchar(255)         not null,
   value                varchar(255)         not null,
   secret               varchar(255)         not null,
   issue_time           int8                 not null,
   constraint PK_OAUTH_TOKEN primary key (id),
   constraint AK_OAUTH_TOKEN unique (uid, resource_id)
)
without oids;

comment on table oauth_token is
'stores oauth access tokens';

-- set table ownership
alter table oauth_token owner to quanda
;
/*==============================================================*/
/* Table: quanda_user                                           */
/*==============================================================*/
create table quanda_user (
   id                   int8                 not null default nextval('quanda_user_id_seq'::regclass),
   uid                  varchar(255)         not null,
   password             varchar(255)         not null,
   creation_time        timestamp            not null,
   constraint PK_QUANDA_USER primary key (id),
   constraint AK_QUANDA_USER unique (uid)
)
without oids;

comment on table quanda_user is
'quanda user information';

-- set table ownership
alter table quanda_user owner to quanda
;
/*==============================================================*/
/* Table: question                                              */
/*==============================================================*/
create table question (
   id                   int8                 not null default nextval('question_id_seq'::regclass),
   clue_id              int8                 not null,
   template_id          int8                 not null,
   user_id              int8                 not null,
   creation_time        timestamp            not null,
   answer               varchar(255)         not null,
   word_difficulty      int4                 not null,
   clue_difficulty      int4                 not null,
   constraint PK_QUESTION primary key (id)
)
without oids;

comment on table question is
'questions asked';

comment on column question.clue_id is
'id of games framework clue';

comment on column question.template_id is
'template id of games framework clue, cached here to avoid extra http call';

comment on column question.user_id is
'player who requested the question';

comment on column question.creation_time is
'question creation time';

comment on column question.answer is
'answer - a word from games framework, cached here to avoid http call';

-- set table ownership
alter table question owner to quanda
;
/*==============================================================*/
/* Index: i_user_id                                             */
/*==============================================================*/
create  index i_user_id on question (
user_id
);

/*==============================================================*/
/* Index: i_user_id_creation_time                               */
/*==============================================================*/
create  index i_user_id_creation_time on question (
user_id,
creation_time
);

/*==============================================================*/
/* Table: version                                               */
/*==============================================================*/
create table version (
   version              int8                 not null default nextval('version_seq'::regclass),
   installed            timestamp            not null default now(),
   constraint PK_VERSION primary key (version)
)
without oids;

comment on table version is
'keeps track of the current database (schema) version';

-- set table ownership
alter table version owner to quanda
;
alter table answer
   add constraint fk_question_fk_answer foreign key (question_id)
      references question (id)
      on delete cascade on update restrict;

alter table oauth_token
   add constraint fk_oauth_token_fk_quanda_user foreign key (uid)
      references quanda_user (uid)
      on delete cascade on update restrict;

alter table question
   add constraint fk_question_fk_quanda_user foreign key (user_id)
      references quanda_user (id)
      on delete restrict on update restrict;

insert into version(version, installed) values(nextval('version_seq'::regclass), CURRENT_TIMESTAMP);