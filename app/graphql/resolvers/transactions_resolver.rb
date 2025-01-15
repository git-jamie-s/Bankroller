# frozen_string_literal: true

module Resolvers
    class TransactionsResolver < BaseResolver
        type(Types::TransactionType.connection_type, null: false)
        argument(:account_id, ID, required: true)
        argument(:query, String, required: false)
        argument(:order, String, required: false)
        argument(:categories, [ String ], required: false)
        argument(:transaction_types, [ String ], required: false)

        def resolve(account_id:, query: "", order: "date desc", categories: [], transaction_types: [])
            transactions = if account_id == "0"
                Transaction.all
            else
                Transaction.where(account_id: account_id)
            end
            unless query.blank?
                transactions = transactions.where("LOWER(description) LIKE ?", "%#{query.downcase}%")
            end

            if transaction_types.any?
                transactions = transactions.where(transaction_type: transaction_types)
            end

            if categories.any?
                transactions = transactions
                    .joins(:category)
                    .where(category: { category: categories })
            end

            if order.starts_with?("category")
                transactions = transactions.joins(:category)

                order = "category." + order
            end

            transactions.order(order)
        end
    end
end
