@echo off
setlocal
set PSQL="C:\Program Files (x86)\PostgreSQL\8.4\bin\psql.exe"
echo Dropping db...
%PSQL%  -d postgres -U postgres -f 000.sql > nul
echo Creating schema db...
for %%i in (s*.sql) do echo %%i && %PSQL% -d t_quanda -U quanda -f %%i > nul
echo Loading test data...
%PSQL% -d t_quanda -U quanda -f test-data.sql > nul
endlocal