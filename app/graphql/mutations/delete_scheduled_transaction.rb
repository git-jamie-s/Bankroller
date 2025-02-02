# frozen_string_literal: true

module Mutations
  class DeleteScheduledTransaction < BaseMutation
    argument :id, ID, required: true

    field :ok, Boolean, null: false

    def resolve(id:)
      ScheduledTransaction.find(id).destroy
      { ok: true }
    end
  end
end
