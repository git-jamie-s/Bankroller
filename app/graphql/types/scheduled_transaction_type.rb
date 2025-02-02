# frozen_string_literal: true

module Types
  class ScheduledTransactionType < Types::BaseObject
    field :id, ID, null: false

    field :account, Types::AccountType, null: false
    field :transaction_type, String, null: false
    field :description, String, null: false

    field :min_amount, Integer, null: false
    field :max_amount, Integer, null: true

    field :start_date, GraphQL::Types::ISO8601Date, null: false

    field :period, String, null: false
    field :weekend_adjust, Types::WeekendAdjustEnum, null: true
  end
end
