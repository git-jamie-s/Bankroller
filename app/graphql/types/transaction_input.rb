# frozen_string_literal: true

module Types
  class TransactionInput < Types::BaseInputObject
    argument :id, ID
    argument :category_id, String, required: false
    argument :description, String, required: false
  end
end
