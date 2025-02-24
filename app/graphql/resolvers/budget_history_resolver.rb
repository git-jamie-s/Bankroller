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
          trunc: "week",
          skip: 1.week
        }
      when "two_weeks"
        {
          start_date: Date.today.beginning_of_week - 24.weeks,
          date_format: "%b %d",
          trunc: "week",
          skip: 2.weeks
        }
      when "twice_monthly"
        raise GraphQL::Error("Twice monthly not supported for charting yet")
      when "monthly"
        {
          start_date: Date.today.beginning_of_month - 1.year,
          date_format: "%b",
          trunc: "month",
          skip: 1.month
        }
      when "yearly"
        {
          start_date: Date.today.beginning_of_year - 3.years,
          date_format: "%Y",
          trunc: "year",
          skip: 1.year
        }
      end.with_indifferent_access


      sums = Transaction.where(category: category)
        .where(date: things[:start_date]..Date.today)
        .group("date_trunc('#{things[:trunc]}', date)")
        .sum(:amount)
        .transform_keys { |k| k.to_date }

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
        sums = new_sums
      end

      # Fill in any periods that don't have an amount.
      puts sums
      date = things[:start_date]
      if period == "two_weeks" && date.cweek & 1 == 1
        date -= 1.week
      end
      while date < Date.today
        sums[date] ||= 0
        date += things[:skip]
      end

      sums
        .sort { |a, b| a[0] <=> b[0] }
        .map do |date, amount|
          {
            date: date.strftime(things[:date_format]),
            amount: amount,
            budget: category.budget_amount
          }
        end
    end
  end
end
