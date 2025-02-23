module Resolvers
  class BudgetHistoryResolver < BaseResolver
    type([ Types::BudgetHistoryReportType ], null: false)
    argument(:category_id, String, required: true)

    def resolve(category_id: nil)
      category = Category.find(category_id)
      if category.nil?
        raise GraphQL::ExecutionError, "Category not found"
      end
      period = category.budget_period

      trunc = case period
      when "monthly"
          "month"
      when "yearly"
          "year"
      else
          "week"
      end

      start_date = case period
      when "monthly"
          Date.today.beginning_of_month - 1.year
      when "yearly"
          Date.today.beginning_of_year - 3.years
      else
          Date.today.beginning_of_week - 3.months
      end

      sums = Transaction.where(category: category)
        .where(date: start_date..Date.today)
        .group("date_trunc('#{trunc}', date)")
        .sum(:amount)
        .sort { |a, b| a[0] <=> b[0] }

      sums.map do |date, amount|
        label = case period
        when "monthly"
            date.strftime("%b %Y")
        when "yearly"
            date.strftime("%Y")
        else
            date.strftime("%b %d")
        end
        {
          date: label,
          amount: amount,
          budget: category.budget_amount
        }
      end
    end
  end
end
