class AutoTransaction < ApplicationRecord
    belongs_to :account, optional: true
    belongs_to :category
end
