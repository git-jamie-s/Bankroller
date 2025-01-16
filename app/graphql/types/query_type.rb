# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [ Types::NodeType, null: true ], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ ID ], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.
    field :accounts, [ Types::AccountType ], null: false, description: "List of accounts"
    def accounts
      Account.all
    end

    field :account, Types::AccountType, null: true, description: "A specific account", resolver: Resolvers::AccountResolver

    field :categories, [ Types::CategoryType ], null: false, description: "List of all categories"
    def categories
      Category.all
    end

    field :autotransactions, [ Types::AutotransactionType ], null: false
    def autotransactions
      Autotransaction.all
    end

    field :transactions, Types::TransactionType.connection_type, null: false, description: "A list of transactions", resolver: Resolvers::TransactionsResolver

    field :transaction_types, [ String ], null: false
    def transaction_types
      Transaction.all.group(:transaction_type).pluck(:transaction_type).sort
    end
  end
end
