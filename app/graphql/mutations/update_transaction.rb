# frozen_string_literal: true

module Mutations
  class UpdateTransaction < BaseMutation
    field :ok, Boolean, null: false

    argument :transaction, Types::TransactionInput, required: true

    def resolve(transaction:)
      record = Transaction.find(transaction.id)


      hash = transaction.to_h
      Rails.logger.info("XXX: #{hash}")

      if hash[:category_id] == ""
        Rails.logger.info("XXX Replacing category")
        hash[:category_id] = nil
        Rails.logger.info("XXX: #{hash}")
      end
      record.update(hash)
      { ok: true }
    end
  end
end
