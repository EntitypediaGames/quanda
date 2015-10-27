/* psql -d postgres -U postgres -f 000.sql */

/* create user quanda first!                                   */
/* CREATE ROLE quanda LOGIN                                    */
/*   PASSWORD '...'  */
/*   NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE;              */


SELECT pg_terminate_backend(pg_stat_activity.procpid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 't_quanda';

DROP DATABASE if exists t_quanda;

CREATE DATABASE t_quanda
  WITH OWNER = quanda
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = -1;