# frozen_string_literal: true

module Resolvers
    class ImportRulesResolver < BaseResolver
        type(Types::ImportRuleType.connection_type, null: false)
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
            import_rules = ImportRule.all

            unless query.blank?
                import_rules = import_rules.where("LOWER(description) LIKE ?", "%#{query.downcase}%")
            end

            if transaction_types.any?
                import_rules = import_rules.where(transaction_type: transaction_types)
            end

            unless min_amount.nil?
                import_rules = if abs_amount
                    import_rules.where("abs(amount) >= ?", min_amount)
                else
                    import_rules.where("amount >= ?", min_amount)
                end
            end
            unless max_amount.nil?
                import_rules = if abs_amount
                    import_rules.where("abs(amount) <= ?", max_amount)
                else
                    import_rules.where("amount <= ?", max_amount)
                end
            end

            if categories.any?
                import_rules = import_rules.where(category_id: categories)
            end

            if order.include?("account")
                import_rules = import_rules.left_joins(:account)
            end

            import_rules.order(order)
        end
    end
end
