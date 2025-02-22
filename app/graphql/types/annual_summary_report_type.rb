# frozen_string_literal: true

module Types
  class AnnualSummaryReportType < Types::BaseObject
    field :total_budget, Integer, null: false
    field :total_spent, Integer, null: false
    field :report_year, Integer, null: false
    field :year_portion, Float, null: false
    field :expenses, [ Types::AnnualSummaryReportRowType ], null: false
  end
end
