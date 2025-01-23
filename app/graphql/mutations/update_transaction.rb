# frozen_string_literal: true

module Mutations
  class UpdateTransaction < BaseMutation
    field :ok, Boolean, null: false

    argument :transaction, Types::TransactionInput, required: true

    def resolve(transaction:)
      record = Transaction.find(transaction.id)
      record.update(transaction.to_h)

      { ok: true }
    end
  end
end
