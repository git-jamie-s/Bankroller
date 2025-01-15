class Account < ApplicationRecord
    has_many :transactions
    def balance
        balance = transactions.last&.balance
        balance || 0
    end
end
