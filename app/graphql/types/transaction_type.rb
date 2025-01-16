# frozen_string_literal: true

module Types
  class TransactionType < Types::BaseObject
    field :id, ID, null: false
    field :account, Types::AccountType, null: false

    field :amount, Integer, null: false
    field :balance, Integer, null: false

    field :bank_transaction_id, String, null: false
    field :cheque_number, String, null: true
    field :date, GraphQL::Types::ISO8601Date, null: false

    field :description, String, null: true
    field :is_read, Boolean, null: false
    field :memo, String, null: true
    field :provisional, Boolean, null: false
    field :transaction_type, String, null: false
    field :notes, String, null: false

    field :category_id, String, null: true
    field :created, GraphQL::Types::ISO8601Date, null: false
  end
end
