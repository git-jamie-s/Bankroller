# frozen_string_literal: true

module Mutations
  class DeleteImportRule < BaseMutation
    argument :id, ID, required: true

    field :ok, Boolean, null: false

    def resolve(id:)
      ImportRule.find(id).destroy
      { ok: true }
    end
  end
end
