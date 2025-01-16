# frozen_string_literal: true

module Resolvers
    class TransactionsResolver < BaseResolver
        type(Types::TransactionType.connection_type, null: false)
        argument(:account_id, ID, required: true)
        argument(:query, String, required: false)
        argument(:order, String, required: false)
        argument(:categories, [ String ], required: false)
        argument(:transaction_types, [ String ], required: false)
        argument(:min_amount, Integer, required: false)
        argument(:max_amount, Integer, required: false)
        argument(:abs_amount, Boolean, required: true)

        def resolve(account_id:,
            query: "",
            order: "date desc",
            categories: [],
            transaction_types: [],
            min_amount: nil,
            max_amount: nil,
            abs_amount: true)
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

            unless min_amount.nil?
                transactions = if abs_amount
                    transactions.where("abs(amount) >= ?", min_amount)
                else
                    transactions.where("amount >= ?", min_amount)
                end
            end
            unless max_amount.nil?
                transactions = if abs_amount
                    transactions.where("abs(amount) <= ?", max_amount)
                else
                    transactions.where("amount <= ?", max_amount)
                end
            end

            if categories.any?
                transactions = transactions.where(category_id: categories)
            end

            transactions.order(order)
        end
    end
end
