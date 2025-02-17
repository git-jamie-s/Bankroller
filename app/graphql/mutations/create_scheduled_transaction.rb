# frozen_string_literal: true

module Mutations
  class CreateScheduledTransaction < BaseMutation
    field :ok, Boolean, null: false

    argument :transaction_id, ID, required: true
    argument :period, Types::PeriodEnum, required: true
    argument :weekend_adjust, Types::WeekendAdjustEnum, required: true

    def resolve(transaction_id:, period:, weekend_adjust:)
      transaction = Transaction.find(transaction_id)

      ScheduledTransaction.create(
        account_id: transaction.account.id,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        min_amount: transaction.amount,
        start_date: transaction.date,
        period:,
        weekend_adjust:
      )

      {
        ok: true
      }
    rescue ActiveRecord::ActiveRecordError => e
      raise GraphQL::ExecutionError, e.message
    end
  end
end
