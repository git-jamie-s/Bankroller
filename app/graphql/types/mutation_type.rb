# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :upsert_auto_transaction, mutation: Mutations::UpsertAutoTransaction
    field :delete_auto_transaction, mutation: Mutations::DeleteAutoTransaction
    field :update_account_name, mutation: Mutations::UpdateAccountName
    field :update_transaction, mutation: Mutations::UpdateTransaction
  end
end
