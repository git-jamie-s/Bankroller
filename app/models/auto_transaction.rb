class AutoTransaction < ApplicationRecord
    belongs_to :account, optional: true
    belongs_to :category

    def match_weight
        @match_weight ||= begin
            w = 1
            w += 2 if account_id.present?
            w += 3 if transaction_type.present?
            w += 5 if amount.present?
            w
        end
    end

    def regex
        @regex ||= begin
            escaped = Regexp.escape(description).gsub('\*','.*?')
            puts "Created expression: #{escaped}"
            Regexp.new "^#{escaped}$", Regexp::IGNORECASE
        end
    end

    # Returns:
    # nil: no match
    # int: match strength (1 lowest)
    def match?(transaction)
        if amount.present? && transaction.amount != amount
            return false
        end
        if transaction_type.present? && transaction_type != transaction.transaction_type
            return false
        end
        regex.match?(transaction.description) ? match_weight : nil
    end
end
