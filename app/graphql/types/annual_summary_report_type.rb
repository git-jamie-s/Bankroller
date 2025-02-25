# frozen_string_literal: true

module Types
  class AnnualSummaryTotalType < Types::BaseObject
    field :year, Integer, null: false
    field :spent, Integer, null: false
    field :budget, Integer, null: true
  end


  class AnnualSummaryReportType < Types::BaseObject
    field :total_budget, Integer, null: false
    field :total_spent, Integer, null: false
    field :report_year, Integer, null: false
    field :year_portion, Float, null: false
    field :expenses, [ Types::AnnualSummaryReportRowType ], null: false
    field :annual_totals, [ Types::AnnualSummaryTotalType ], null: false
  end
end
