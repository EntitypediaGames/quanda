SET client_min_messages TO WARNING;

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

SET search_path = public, pg_catalog;

INSERT INTO quanda_user (id, creation_time, password, uid) VALUES (1, '2015-02-15 15:21:00.958', 'G5bMmFKTUCqHHEPOBO3G', 'pgf1');
INSERT INTO quanda_user (id, creation_time, password, uid) VALUES (2, '2015-02-15 15:22:00.958', 'wlAjuIFR0XVad2h6js3v', 'pgf2');
SELECT pg_catalog.setval('quanda_user_id_seq', 3, false);

--/*'country in Asia', */
INSERT INTO question (id, user_id, creation_time, answer, clue_id, template_id, clue_difficulty, word_difficulty) VALUES (1, 1, '2015-02-15 16:00:00.059', 'thailand', 32, 1, 2, 5);
--/*'elegant and sumptuous',*/
INSERT INTO question (id, user_id, creation_time, answer, clue_id, template_id, clue_difficulty, word_difficulty) VALUES (2, 1, '2015-02-15 16:01:01.146', 'luxe', 2514781, 2, 2, 5);
--/*'cause to go crazy; cause to lose one''s mind',*/
INSERT INTO question (id, user_id, creation_time, answer, clue_id, template_id, clue_difficulty, word_difficulty) VALUES (3, 1, '2015-02-15 16:06:45.921', 'madden', 2514814, 2, 2, 5);
SELECT pg_catalog.setval('question_id_seq', 4, false);


INSERT INTO oauth_token (id, uid, resource_id, value, secret, issue_time) VALUES (1, 'pgf1', 'game-framework', '979b085a-0e76-4660-b8f8-f7dc5d482382', 'Jm7m+IjnZV9RzyQbWQHGRvtG32ReyDbZyab+spLMnYZ1NtsIsgG0BumMK0O5giD57bifg1n4pBJ4AU9a7pZhe9ecY+grMSScLZRH3LIDgow=', 1413810987616);
INSERT INTO oauth_token (id, uid, resource_id, value, secret, issue_time) VALUES (2, 'pgf2', 'game-framework', '979b085a-0e76-4660-b8f8-f7dc5d482382', 'Jm7m+IjnZV9RzyQbWQHGRvtG32ReyDbZyab+spLMnYZ1NtsIsgG0BumMK0O5giD57bifg1n4pBJ4AU9a7pZhe9ecY+grMSScLZRH3LIDgow=', 1413810987616);
SELECT pg_catalog.setval('oauth_token_id_seq', 3, false);