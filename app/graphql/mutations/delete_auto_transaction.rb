# frozen_string_literal: true

module Mutations
  class DeleteAutoTransaction < BaseMutation
    argument :id, ID, required: true

    field :ok, Boolean, null: false

    def resolve(id:)
      AutoTransaction.find(id).destroy
      { ok: true }
    end
  end
end
