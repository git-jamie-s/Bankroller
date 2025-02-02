# frozen_string_literal: true

module Mutations
  class UpsertImportRule < BaseMutation
    field :ok, Boolean, null: false
    field :import_rule, Types::ImportRuleType

    argument :import_rule, Types::ImportRuleInput, required: true
    argument :apply, Boolean, required: true

    def resolve(import_rule:, apply:)
      if import_rule.id.present?
        record = ImportRule.find(import_rule.id)
        record.update(import_rule.to_h)
      else
        record = ImportRule.create(import_rule.to_h)
      end

      if apply
        Rails.logger.info("XXXX TODO: Apply this!")
      end

      {
        import_rule: record,
        ok: true
      }
    rescue ActiveRecord::ActiveRecordError => e
      raise GraphQL::ExecutionError, e.message
    end
  end
end
