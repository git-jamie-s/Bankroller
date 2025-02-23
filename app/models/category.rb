class Category < ApplicationRecord
  enum :budget_period, ScheduledTransaction::PERIODS.zip(ScheduledTransaction::PERIODS).to_h


  def annual_budget
    case (budget_period)
    when :yearly
      budget_amount
    when :monthly
      budget_amount * 12
    when :weekly
      budget_amount * 52
    when :two_weeks
      budget_amount * 26
    when :twice_monthly
      budget_amount * 24
    end
  end
end
