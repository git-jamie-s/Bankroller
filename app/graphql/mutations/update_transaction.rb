# frozen_string_literal: true

module Mutations
  class UpdateTransaction < BaseMutation
    field :ok, Boolean, null: false

    argument :transaction, Types::TransactionInput, required: true

    def resolve(transaction:)
      record = Transaction.find(transaction.id)

      cat = transaction.category_id
      unless cat.nil?
        unless Category.find_by(id: transaction.category_id).present?
          Category.create(id: cat)
        end
      end

      hash = transaction.to_h
      if hash[:category_id] == ""
        hash[:category_id] = nil
      end
      record.update(hash)
      { ok: true }
    end
  end
end
