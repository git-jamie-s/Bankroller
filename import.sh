# pg_dump -t account -t category bankroll -t transaction | psql -d bankroller_development

psql -d bankroller_development <<HERE
BEGIN
INSERT into accounts(id, account_name, account_type, bank_account_id, bank_id, creditcard_cycle_date, notes, created) 
    SELECT id, account_name, account_type, bank_account_id, bank_id, creditcard_cycle_date, notes, created FROM account;

SELECT setval(pg_get_serial_sequence('accounts', 'id'), max(id)) FROM accounts;

INSERT into categories (id, budget_amount, budget_period, category)
    SELECT id, budget_amount, budget_period, category FROM category;

SELECT setval(pg_get_serial_sequence('categories', 'id'), max(id)) FROM categories;

INSERT into transactions(id, amount, balance, bank_transaction_id, cheque_number,
    date, description, is_read, memo, provisional,
    transaction_type, account_id, category_id, notes) 
    SELECT id, amount, balance, bank_transaction_id, cheque_number,
    date, description, is_read, memo, provisional,
    transaction_type, account_id, category_id, notes FROM transaction;

SELECT setval(pg_get_serial_sequence('transactions', 'id'), max(id)) FROM transactions;

DROP TABLE transaction CASCADE;
DROP TABLE account CASCADE;
DROP TABLE category CASCADE;
COMMIT
HERE