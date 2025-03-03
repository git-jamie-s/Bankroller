pg_dump -t account -t category -t transaction -t autotransaction -t scheduledtransaction bankroll | psql -d bankroller_development

psql -d bankroller_development <<HERE
BEGIN;
INSERT into accounts(id, account_name, account_type, bank_account_id, bank_id, creditcard_cycle_date, notes, created) 
    SELECT id, account_name, account_type, bank_account_id, bank_id, creditcard_cycle_date, notes, created FROM account;

SELECT setval(pg_get_serial_sequence('accounts', 'id'), max(id)) FROM accounts;

CREATE TEMPORARY TABLE cat_lookup(
   bp bigint,
   budget_period varchar
);
INSERT INTO cat_lookup (bp, budget_period) VALUES (0, 'weekly');
INSERT INTO cat_lookup (bp, budget_period) VALUES (1, 'two_weeks');
INSERT INTO cat_lookup (bp, budget_period) VALUES (2, 'monthly');
INSERT INTO cat_lookup (bp, budget_period) VALUES (3, 'twice_monthly');
INSERT INTO cat_lookup (bp, budget_period) VALUES (4, 'yearly');

INSERT into categories (id, budget_amount, budget_period)
    SELECT category, budget_amount, catl.budget_period FROM category INNER JOIN cat_lookup catl ON (category.budget_period = catl.bp);

INSERT into transactions(id, amount, balance, cheque_number,
    date, description, memo, provisional,
    transaction_type, account_id, category_id, notes) 
  SELECT transaction.bank_transaction_id, transaction.amount, balance, cheque_number,
    date, description, memo, provisional,
    transaction_type, account_id, category.category, notes 
  FROM transaction LEFT OUTER JOIN category ON (transaction.category_id = category.id)
  WHERE transaction_type != 'LEDGER';

INSERT into import_rules(id, amount, description, transaction_type, category_id, account_id)
  SELECT autotransaction.id, amount, description, transaction_type, category.category, account_id
  FROM autotransaction LEFT OUTER JOIN category ON (autotransaction.category_id=category.id);

SELECT setval(pg_get_serial_sequence('import_rules', 'id'), max(id)) FROM import_rules;

CREATE TEMPORARY TABLE shed_lookup(
   p varchar,
   period varchar
);
INSERT INTO shed_lookup (p, period) VALUES ('WEEKLY', 'weekly');
INSERT INTO shed_lookup (p, period) VALUES ('BIWEEKLY', 'two_weeks');
INSERT INTO shed_lookup (p, period) VALUES ('MONTHLY', 'monthly');
INSERT INTO shed_lookup (p, period) VALUES ('MONTHLYx2', 'twice_monthly');
INSERT INTO shed_lookup (p, period) VALUES ('YEARLY', 'yearly');

INSERT INTO scheduled_transactions
  (id, account_id, transaction_type, description, min_amount, period, weekend_adjust, start_date)
  SELECT scheduledtransaction_id, account_id, transaction_type, description, amount, shed_lookup.period, weekend_adjust, start_date
  FROM scheduledtransaction INNER JOIN shed_lookup ON (scheduledtransaction.period = shed_lookup.p);

SELECT setval(pg_get_serial_sequence('scheduled_transactions', 'id'), max(id)) FROM scheduled_transactions;

COMMIT;

BEGIN;
DROP TABLE autotransaction CASCADE;
DROP TABLE transaction CASCADE;
DROP TABLE account CASCADE;
DROP TABLE category CASCADE;
DROP TABLE scheduledtransaction CASCADE;
COMMIT;
HERE