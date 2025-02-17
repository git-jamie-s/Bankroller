class Category < ApplicationRecord
  enum :budget_period, ScheduledTransaction::PERIODS.zip(PERIODS).to_h
end
