class Account < ApplicationRecord
    has_many :transactions

    def balance
        # This is making the very large assumption that for any given day, bank transaction ids are linear/growing
        balance = transactions.order(date: :desc, id: :desc).first&.balance
        balance || 0
    end
end
