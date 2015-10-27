Database schema is versioned by sequential numbers 1,2,3,...  The version of the database schema is stored in the "version" table.
For every version of the database schema there is a respective script sNNN.sql (number padded with zeros, for example s010.sql) which updates the database schema from version N-1 to N.

Every update to the database schema (e.g. sNNN.sql) must update version table in the database:
insert into version(version,installed) values(nextval('version_seq'::regclass), CURRENT_TIMESTAMP);

The test data is stored in the test-data.sql file.

On every update of the database create a file with the next number in sequence.
After generating an update script, test it on the test database, then add to the bottom "insert into version..." line above and commit it here.

Make sure scripts properly assign ownership to all database objects using "alter XXX YYY owner to quanda;"

psql utility can be used to update the database, for example:
psql -d quanda -U quanda -f s001.sql

To recreate database one can use something like (in cmd):
for %i in (s*.sql) do psql -d quanda -U quanda -f %i

For this commands to work without asking a password one needs to set PGPASSWORD environment variable to contain password 
or one can create a ~/.pgpass file (%APPDATA%\postgresql\pgpass.conf on Windows) with a line in the following format:
hostname:port:database:username:password

Before a database update it is recommended to make a backup, for example
pg_dump --host localhost --port 5432 --username "postgres" --format custom --blobs --verbose --file quanda.backup quanda