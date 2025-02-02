# frozen_string_literal: true

module Types
  class ImportRuleType < Types::BaseObject
    field :id, ID, null: false

    field :account, Types::AccountType, null: true
    field :category_id, String, null: false
    field :transaction_type, String, null: true

    field :amount, Integer, null: true
    field :description, String, null: false
  end
end
