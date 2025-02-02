# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_01_10_031028) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "account_name"
    t.string "account_type"
    t.string "bank_account_id"
    t.string "bank_id"
    t.integer "creditcard_cycle_date"
    t.string "notes"
    t.datetime "created"
  end

  create_table "categories", id: :string, force: :cascade do |t|
    t.bigint "budget_amount"
    t.integer "budget_period"
  end

  create_table "import_rules", force: :cascade do |t|
    t.string "description", null: false
    t.string "category_id", null: false
    t.bigint "account_id"
    t.string "transaction_type"
    t.bigint "amount"
    t.index ["description", "category_id", "account_id", "transaction_type", "amount"], name: "import_rules_all_unique", unique: true, nulls_not_distinct: true
  end

  create_table "scheduled_transactions", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.string "transaction_type", null: false
    t.string "description", null: false
    t.bigint "min_amount", null: false
    t.bigint "max_amount"
    t.string "period", null: false
    t.string "weekend_adjust", null: false
    t.date "start_date", null: false
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
    t.string "category_id"
    t.string "notes", default: "", null: false
  end

  add_foreign_key "import_rules", "accounts", name: "fkks6fwyv2qo7svlfn35872k9or"
  add_foreign_key "import_rules", "categories", name: "fk4tlwv09bjvqo1a57ynfu4x4oi"
  add_foreign_key "scheduled_transactions", "accounts", name: "fkqbg7u61v57f84hu9xbamsk2mc"
  add_foreign_key "transactions", "accounts", name: "fk60ogq0ga4x4y0fkeu24tgm0kv"
  add_foreign_key "transactions", "categories", name: "fkdv2mk0d5egsjapqkwcjgyw4ta"
end
