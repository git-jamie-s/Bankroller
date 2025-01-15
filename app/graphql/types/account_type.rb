# frozen_string_literal: true

module Types
  class AccountType < Types::BaseObject
    field :id, ID, null: false
    field :account_name, String, null: false
    field :account_type, String
    field :bank_account_id, String, null: false
    field :bank_id, String, null: false
    field :creditcard_cycle_date, Integer
    field :balance, Integer, null: false
    field :notes, String
    field :created, GraphQL::Types::ISO8601Date, null: false
  end
end
