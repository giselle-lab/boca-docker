-- Adminer 4.8.1 PostgreSQL 14.10 dump

DROP TABLE IF EXISTS "tagtable";
DROP SEQUENCE IF EXISTS tagtable_tagid_seq;
CREATE SEQUENCE tagtable_tagid_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."tagtable" (
    "tag_id" integer DEFAULT nextval('tagtable_tagid_seq') NOT NULL,
    "entity_type" character varying(50) NOT NULL,
    "entity_id" character varying(50) NOT NULL,
    "tag_name" character varying(50) NOT NULL,
    "tag_value" character varying(50),
    "updatetime" integer DEFAULT EXTRACT(epoch FROM now()) NOT NULL,
    CONSTRAINT "tag_index" UNIQUE ("entity_type", "entity_id", "tag_name"),
    CONSTRAINT "tagtable_pkey" PRIMARY KEY ("tag_id")
) WITH (oids = false);

INSERT INTO "tagtable" ("tag_id", "entity_type", "entity_id", "tag_name", "tag_value", "updatetime") VALUES
(2,	'problem',	'2006',	'level',	'easy',	1651674058),
(3,	'problem',	'2006',	'domain',	'basic select',	1651674058),
(4,	'problem',	'2006',	'lang',	'relax',	1651674058),
(5,	'site/user',	'1/1001',	'working',	'atividade 01',	1651674058),
(1,	'contest',	'2006',	'group',	'silberschatz',	1651674058);

-- 2023-11-16 21:00:53.121478+00
