psql -d postgres -U postgres -f 000.sql > /dev/null
for file in ./s*.sql; do
    echo "$file"
    psql -d t_quanda -U quanda -f "$file" > /dev/null
done
psql -d t_quanda -U quanda -f test-data.sql > /dev/null