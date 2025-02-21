# frozen_string_literal: true

module Mutations
  class UpdateCategory < BaseMutation
    field :ok, Boolean, null: false

    argument :category, Types::CategoryInput, required: true

    def resolve(category:)
      record = Category.find(category.id)
      hash = category.to_h
      record.update(hash)
      { ok: true }
    end
  end
end
