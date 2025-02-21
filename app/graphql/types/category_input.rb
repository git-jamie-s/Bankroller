# frozen_string_literal: true

module Types
  class CategoryInput < Types::BaseInputObject
    argument :id, ID
    argument :budget_period, Types::PeriodEnum, required: false
    argument :budget_amount, Integer, required: false
  end
end
