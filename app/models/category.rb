class Category < ApplicationRecord
  enum :budget_period, ScheduledTransaction::PERIODS.zip(ScheduledTransaction::PERIODS).to_h


  def annual_budget
    case (budget_period)
    when "YEARLY"
      budget_amount
    when "MONTHLY"
      budget_amount * 12
    when "WEEKLY"
      budget_amount * 52
    when "BIWEEKLY"
      budget_amount * 26
    when "MONTHLYx2"
      budget_amount * 24
    end
  end
end
