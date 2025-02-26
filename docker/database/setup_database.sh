#!/bin/sh

createuser bankroll
psql -c "ALTER USER bankroll WITH PASSWORD '${BANKROLL_PW}"
createdb bankroll --owner bankroll 2> /dev/null || echo 'bankroll database already exists?'

createuser llm
createdb llm --owner llm 2> /dev/null || echo 'llm database already exists?'
psql -U postgres -d llm -h localhost -c "CREATE EXTENSION vector;"
