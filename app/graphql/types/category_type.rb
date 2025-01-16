# frozen_string_literal: true

module Types
  class CategoryType < Types::BaseObject
    field :id, String, null: false

    field :budget_amount, Integer, null: true
    field :budget_period, Integer, null: true

    field :created, GraphQL::Types::ISO8601Date, null: false
  end
end
