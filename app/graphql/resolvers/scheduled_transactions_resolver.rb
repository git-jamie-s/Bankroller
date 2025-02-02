# frozen_string_literal: true

module Resolvers
    class ScheduledTransactionsResolver < BaseResolver
        type([ Types::ScheduledTransactionType ], null: false)

        argument(:query, String, required: false)
        argument(:order, String, required: false)
        argument(:transaction_types, [ String ], required: false)
        argument(:account_id, ID, required: false)

        def resolve(query: "",
            order: "description desc",
            categories: [],
            transaction_types: [],
            account_id: nil)
            scheduled_transactions = ScheduledTransaction.all

            unless query.blank?
                scheduled_transactions = scheduled_transactions.where("LOWER(description) LIKE ?", "%#{query.downcase}%")
            end

            if transaction_types.any?
                scheduled_transactions = scheduled_transactions.where(transaction_type: transaction_types)
            end

            if account_id.present?
              scheduled_transactions = scheduled_transactions.where(account_id:)
            end

            if order.include?("account")
                scheduled_transactions = scheduled_transactions.left_joins(:account)
            end

            Rails.logger.info("Count: #{scheduled_transactions.count}")

            scheduled_transactions.order(order)
        end
    end
end
