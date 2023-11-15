-- @Table: tagtable
-- @Description: Table to store tags for BOCA entities
-- @Columns: tagid, entitytype, entityid, tagname, tagvalue, updatetime
-- @Constraints: tag_pkey (primary key), tag_index (index)
-- @Inserts: Data for tagtable
-- @DropTableIfExists
DROP TABLE IF EXISTS tagtable;
CREATE TABLE tagtable (
    tagid SERIAL PRIMARY KEY,
    entitytype VARCHAR(50) NOT NULL,
    entityid VARCHAR(50) NOT NULL,
    tagname VARCHAR(50) NOT NULL,
    tagvalue VARCHAR(50),
    updatetime INT DEFAULT EXTRACT(epoch FROM now()) NOT NULL,
    CONSTRAINT tag_index UNIQUE (entitytype, entityid, tagname)
);

-- Example data for tagtable
-- @InsertData
INSERT INTO tagtable (entitytype, entityid, tagname, tagvalue, updatetime) VALUES
('problem', '2006', 'group', 'silberschatz', 1651674058),
('problem', '2006', 'level', 'easy', 1651674058),
('problem', '2006', 'domain', 'basic select', 1651674058),
('problem', '2006', 'lang', 'relax', 1651674058),
('site/user', '1/1001', 'working', 'atividade 01', 1651674058);
-- ... (other rows)

-- @EndOfFile
