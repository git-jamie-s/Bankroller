# frozen_string_literal: true

module Mutations
  class UpdateScheduledTransaction < BaseMutation
    field :ok, Boolean, null: false

    argument :id, ID, required: true
    argument :min_amount, Integer, required: true
    argument :max_amount, Integer, required: false

    def resolve(id:, min_amount:, max_amount:)
      record = ScheduledTransaction.find(id)

      record.update(min_amount:, max_amount:)
      { ok: true }
    end
  end
end
