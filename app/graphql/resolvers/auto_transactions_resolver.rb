# frozen_string_literal: true

module Resolvers
    class AutoTransactionsResolver < BaseResolver
        type(Types::AutoTransactionType.connection_type, null: false)
        argument(:query, String, required: false)
        argument(:order, String, required: false)
        argument(:categories, [ String ], required: false)
        argument(:transaction_types, [ String ], required: false)
        argument(:min_amount, Integer, required: false)
        argument(:max_amount, Integer, required: false)
        argument(:abs_amount, Boolean, required: true)

        def resolve(query: "",
            order: "description desc",
            categories: [],
            transaction_types: [],
            min_amount: nil,
            max_amount: nil,
            abs_amount: true)
            auto_transactions = AutoTransaction.all

            unless query.blank?
                auto_transactions = auto_transactions.where("LOWER(description) LIKE ?", "%#{query.downcase}%")
            end

            if transaction_types.any?
                auto_transactions = auto_transactions.where(transaction_type: transaction_types)
            end

            unless min_amount.nil?
                auto_transactions = if abs_amount
                    auto_transactions.where("abs(amount) >= ?", min_amount)
                else
                    auto_transactions.where("amount >= ?", min_amount)
                end
            end
            unless max_amount.nil?
                auto_transactions = if abs_amount
                    auto_transactions.where("abs(amount) <= ?", max_amount)
                else
                    auto_transactions.where("amount <= ?", max_amount)
                end
            end

            if categories.any?
                auto_transactions = auto_transactions.where(category_id: categories)
            end

            if order.include?("account")
                auto_transactions = auto_transactions.left_joins(:account)
            end

            auto_transactions.order(order)
        end
    end
end
