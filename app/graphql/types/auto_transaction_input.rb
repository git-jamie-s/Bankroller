# frozen_string_literal: true

module Types
  class AutoTransactionInput < Types::BaseInputObject
    argument :id, ID
    argument :account_id, ID, required: false
    argument :category_id, String
    argument :transaction_type, String, required: false
    argument :amount, Integer, required: false
    argument :description, String
  end
end
