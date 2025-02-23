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

      things = case period
      when "weekly"
        {
          start_date: Date.today.beginning_of_week - 24.weeks,
          date_format: "%b %d",
          trunc: "week"
        }
      when "two_weeks"
        {
          start_date: Date.today.beginning_of_week - 12.weeks,
          date_format: "%b %d",
          trunc: "week"
        }
      when "twice_monthly"
        nil
      when "monthly"
        {
          start_date: Date.today.beginning_of_month - 1.year,
          date_format: "%b",
          trunc: "month"
        }
      when "yearly"
        {
          start_date: Date.today.beginning_of_year - 3.years,
          date_format: "%Y",
          trunc: "year"
        }
      end.with_indifferent_access


      sums = Transaction.where(category: category)
        .where(date: things[:start_date]..Date.today)
        .group("date_trunc('#{things[:trunc]}', date)")
        .sum(:amount)
        .sort { |a, b| a[0] <=> b[0] }

      if period == "two_weeks"
        # Merge every 2 weeks together
        new_sums = {}
        sums.each do |date, amount|
          cw = date.to_date.cweek
          puts "cweek: #{cw}"
          if cw & 1 == 1
            date -= 1.week
            puts "Adjusting date down by 1 week to: #{date}"
          end
          amount += new_sums[date] || 0
          new_sums[date] = amount
        end

        puts "old sums: #{sums}"
        puts "new sums: #{new_sums}"
        sums = new_sums
      end

      sums.map do |date, amount|
        {
          date: date.strftime(things[:date_format]),
          amount: amount,
          budget: category.budget_amount
        }
      end
    end
  end
end
