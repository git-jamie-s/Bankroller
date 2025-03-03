# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :upsert_import_rule, mutation: Mutations::UpsertImportRule
    field :delete_import_rule, mutation: Mutations::DeleteImportRule
    field :update_account_name, mutation: Mutations::UpdateAccountName
    field :update_transaction, mutation: Mutations::UpdateTransaction
    field :delete_scheduled_transaction, mutation: Mutations::DeleteScheduledTransaction
    field :create_scheduled_transaction, mutation: Mutations::CreateScheduledTransaction
    field :update_scheduled_transaction, mutation: Mutations::UpdateScheduledTransaction
    field :update_category, mutation: Mutations::UpdateCategory
  end
end
