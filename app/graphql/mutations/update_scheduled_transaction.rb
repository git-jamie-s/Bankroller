# frozen_string_literal: true

module Mutations
  class UpdateScheduledTransaction < BaseMutation
    field :ok, Boolean, null: false

    argument :scheduled_transaction, Types::ScheduledTransactionInput, required: true

    def resolve(scheduled_transaction:)
      record = ScheduledTransaction.find(scheduled_transaction.id)

      hash = scheduled_transaction.to_h
      record.update(hash)
      { ok: true }
    end
  end
end
