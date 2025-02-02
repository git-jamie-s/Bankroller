# frozen_string_literal: true

module Types
  class ScheduledTransactionInput < Types::BaseInputObject
    argument :id, ID, required: true
    argument :min_amount, Integer, required: true
    argument :max_amount, Integer, required: false
  end
end
