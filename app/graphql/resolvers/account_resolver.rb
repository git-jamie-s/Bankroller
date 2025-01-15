# frozen_string_literal: true

module Resolvers
    class AccountResolver < BaseResolver
        type(Types::AccountType, null: true)
        argument(:id, ID, required: true)

        def resolve(id:)
            if id == "0"
                return Account.new(id: 0, account_name: "All accounts", created: Time.now)
            end
            Account.find(id)
        end
    end
end