# frozen_string_literal: true

module Mutations
  class UpdateAutoTransaction < BaseMutation
    field :ok, Boolean, null: false

    argument :auto_transaction, Types::AutoTransactionInput, required: true

    def resolve(auto_transaction:)
      record = AutoTransaction.find(auto_transaction.id)
      Rails.logger.info("XXXX Saving: #{auto_transaction.to_h}")
      record.update(auto_transaction.to_h)

      { ok: true }
    end
  end
end
