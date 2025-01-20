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
      t.integer "budget_period"
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

    create_table "auto_transactions", force: :cascade do |t|
      t.bigint "amount"
      t.string "description", null: false
      t.string "transaction_type"
      t.string "category_id", null: false
      t.bigint "account_id"
    end

    add_foreign_key "transactions", "accounts", name: "fk60ogq0ga4x4y0fkeu24tgm0kv"
    add_foreign_key "transactions", "categories", name: "fkdv2mk0d5egsjapqkwcjgyw4ta"
    add_foreign_key "auto_transactions", "accounts", name: "fkks6fwyv2qo7svlfn35872k9or"
    add_foreign_key "auto_transactions", "categories", name: "fk4tlwv09bjvqo1a57ynfu4x4oi"
  end
end
