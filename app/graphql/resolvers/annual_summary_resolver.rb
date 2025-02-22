module Resolvers
  class AnnualSummaryResolver < BaseResolver
    type(Types::AnnualSummaryReportType, null: false)
    argument(:report_year, Integer, required: false)

    def resolve(report_year: nil)
      jan_1 = Time.now().beginning_of_year()
      end_of_year = jan_1.end_of_year()

      sums = Transaction.where(date: jan_1..end_of_year).group(:category_id).sum(:amount)
      nocat = Transaction.where(category_id: nil, date: jan_1..end_of_year).sum(:amount)
      sums["uncategorized"] = nocat

      Rails.logger.info("sums: #{sums}")

      categories = Category.all

      total_spent = 0
      total_budget = 0

      expenses = categories.map do |c|
        next unless c.id.start_with?("expenses/")

        total_budget += c.annual_budget || 0
        spent = sums[c.id] || 0
        total_spent += spent

        {
          category: c.id,
          annual_budget: c.annual_budget || 0,
          spent: spent || 0
        }
      end.compact.sort { |a, b| a[:category] <=> b[:category] }

      {
          total_budget:,
          total_spent:,
          report_year: jan_1.year,
          expenses: expenses
      }
    end
  end
end
