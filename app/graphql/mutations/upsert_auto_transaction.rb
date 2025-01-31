# frozen_string_literal: true

module Mutations
  class UpsertAutoTransaction < BaseMutation
    field :ok, Boolean, null: false
    field :auto_transaction, Types::AutoTransactionType

    argument :auto_transaction, Types::AutoTransactionInput, required: true
    argument :apply, Boolean, required: true

    def resolve(auto_transaction:, apply:)
      if auto_transaction.id.present?
        record = AutoTransaction.find(auto_transaction.id)
        record.update(auto_transaction.to_h)
      else
        record = AutoTransaction.create(auto_transaction.to_h)
      end

      if apply
        Rails.logger.info("XXXX TODO: Apply this!")
      end

      {
        auto_transaction: record,
        ok: true
      }
    rescue ActiveRecord::ActiveRecordError => e
      raise GraphQL::ExecutionError, e.message
    end
  end
end
