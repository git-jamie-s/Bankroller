pg_dump -t account -t category -t transaction -t autotransaction bankroll | psql -d bankroller_development

psql -d bankroller_development <<HERE
BEGIN;
INSERT into accounts(id, account_name, account_type, bank_account_id, bank_id, creditcard_cycle_date, notes, created) 
    SELECT id, account_name, account_type, bank_account_id, bank_id, creditcard_cycle_date, notes, created FROM account;

SELECT setval(pg_get_serial_sequence('accounts', 'id'), max(id)) FROM accounts;

INSERT into categories (id, budget_amount, budget_period)
    SELECT category, budget_amount, budget_period FROM category;

INSERT into transactions(id, amount, balance, bank_transaction_id, cheque_number,
    date, description, is_read, memo, provisional,
    transaction_type, account_id, category_id, notes) 
  SELECT transaction.id, transaction.amount, balance, bank_transaction_id, cheque_number,
    date, description, is_read, memo, provisional,
    transaction_type, account_id, category.category, notes 
FROM transaction LEFT OUTER JOIN category ON (transaction.category_id = category.id);

SELECT setval(pg_get_serial_sequence('transactions', 'id'), max(id)) FROM transactions;

INSERT into autotransactions(id, amount, description, transaction_type, category_id, account_id)
  SELECT autotransaction.id, amount, description, transaction_type, category.category, account_id
  FROM autotransaction LEFT OUTER JOIN category ON (autotransaction.category_id=category.id);

SELECT setval(pg_get_serial_sequence('autotransactions', 'id'), max(id)) FROM autotransactions;
COMMIT;
BEGIN;
DROP TABLE autotransaction CASCADE;
DROP TABLE transaction CASCADE;
DROP TABLE account CASCADE;
DROP TABLE category CASCADE;
COMMIT;
HERE