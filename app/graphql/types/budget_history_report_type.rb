# frozen_string_literal: true

module Types
  class BudgetHistoryReportType < Types::BaseObject
    field :date, String, null: false
    field :amount, Integer, null: false
    field :budget, Integer, null: false
  end
end
