module Resolvers
  class AnnualSummaryResolver < BaseResolver
    type(Types::AnnualSummaryReportType, null: false)
    argument(:report_year, Integer, required: false)

    def resolve(report_year: Time.now().year)
      report_start_time = Time.new(report_year).beginning_of_year
      report_year_end_time = report_start_time.end_of_year()

      current_year = Time.now().year
      report_end_time = report_year == current_year ? Time.now() : report_year_end_time
      sums = Transaction.where(date: report_start_time..report_year_end_time).group(:category_id).sum(:amount)

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

      nocat = Transaction.where(category_id: nil, date: report_start_time..report_year_end_time).sum(:amount)
      expenses << {
        category: "uncategorized",
        annual_budget: 0,
        spent: nocat
      }


      annual_totals = []
      4.times do |i|
        year = report_start_time.year - i
        # Only include budget for the current year
        budget = i == 0 && report_year == current_year ? total_budget : nil
        annual_totals << {
          year:,
          budget:,
          spent: year_total(report_start_time - i.year)
        }
      end

      {
          total_budget:,
          total_spent:,
          report_year: report_year,
          year_portion: (report_end_time - report_start_time) / (report_year_end_time - report_start_time),
          expenses: expenses,
          annual_totals:
      }
    end

    def year_total(start_time)
      total = Transaction
        .where(date: start_time..start_time + 1.year)
        .where("category_id LIKE 'expenses/%' or category_id IS NULL")
        .sum(:amount)
      total
    end
  end
end
