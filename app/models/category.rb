class Category < ApplicationRecord
  enum :budget_period, ScheduledTransaction::PERIODS.zip(ScheduledTransaction::PERIODS).to_h
end
