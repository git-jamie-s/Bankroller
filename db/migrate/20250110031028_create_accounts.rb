class CreateAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :accounts do |t|
      t.string :account_name
      t.string :account_type
      t.string :bank_account_id
      t.string :bank_id
      t.integer :creditcard_cycle_date
      t.string :notes

      t.timestamps
    end
  end
end
