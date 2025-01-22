# frozen_string_literal: true

module Mutations
  class UpdateAccountName < BaseMutation
    field :ok, Boolean, null: false

    argument :account_id, ID, required: true
    argument :account_name, String, required: true

    def resolve(account_id:, account_name:)
      if account_name.blank?
        raise GraphQL::ExecutionError, "Name must not be blank"
      end

      record = Account.find(account_id)
      record.update(account_name:)

      { ok: true }
    end
  end
end
