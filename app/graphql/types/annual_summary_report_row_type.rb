# frozen_string_literal: true

module Types
  class AnnualSummaryReportRowType < Types::BaseObject
    field :category, String, null: false
    field :annual_budget, Integer, null: false
    field :spent, Integer, null: false
  end
end
