# frozen_string_literal: true

module Types
  class AutotransactionType < Types::BaseObject
    field :id, ID, null: false

    field :account, Types::AccountType, null: false
    field :category, Types::CategoryType, null: true
    field :transaction_type, String, null: false

    field :amount, Integer, null: false
    field :description, String, null: true
  end
end
