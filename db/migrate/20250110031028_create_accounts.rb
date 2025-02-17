class CreateAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table "accounts" do |t|
      t.string "account_name"
      t.string "account_type"
      t.string "bank_account_id"
      t.string "bank_id"
      t.integer "creditcard_cycle_date"
      t.string "notes"

      t.datetime "created"
    end

    create_table "categories", id: :string do |t|
      t.bigint "budget_amount"
      t.string "period"
    end

    create_table "transactions", id: :string, force: :cascade do |t|
      t.bigint "amount", null: false
      t.bigint "balance"
      t.string "cheque_number", limit: 255
      t.date "date"
      t.string "description", limit: 255
      t.string "memo", limit: 255
      t.boolean "provisional", null: false
      t.string "transaction_type", limit: 255
      t.bigint "account_id", null: false
      t.string "category_id", null: true
      t.string "notes", default: "", null: false
    end
    add_foreign_key "transactions", "accounts", name: "fk60ogq0ga4x4y0fkeu24tgm0kv"
    add_foreign_key "transactions", "categories", name: "fkdv2mk0d5egsjapqkwcjgyw4ta"

    create_table "import_rules", force: :cascade do |t|
      t.string "description", null: false
      t.string "category_id", null: false
      t.bigint "account_id"
      t.string "transaction_type"
      t.bigint "amount"
      t.index [ "description", "category_id", "account_id", "transaction_type", "amount" ], name: "import_rules_all_unique", unique: true, nulls_not_distinct: true
    end

    add_foreign_key "import_rules", "accounts", name: "fkks6fwyv2qo7svlfn35872k9or"
    add_foreign_key "import_rules", "categories", name: "fk4tlwv09bjvqo1a57ynfu4x4oi"

    create_table "scheduled_transactions", force: :cascade do |t|
      t.bigint "account_id", null: false
      t.string "transaction_type", null: false
      t.string "description", null: false
      t.bigint "min_amount", null: false
      t.bigint "max_amount"
      t.string "period", null: false
      t.string "weekend_adjust", null: false
      t.date   "start_date", null: false
    end
    add_foreign_key "scheduled_transactions", "accounts", name: "fkqbg7u61v57f84hu9xbamsk2mc"
  end
end
