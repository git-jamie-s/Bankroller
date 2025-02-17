class Types::PeriodEnum < Types::BaseEnum
  value("Weekly", value: "WEEKLY")
  value("TwoWeeks", value: "BIWEEKLY")
  value("Monthly", value: "MONTHLY")
  value("TwiceMonthly", value: "MONTHLYx2")
  value("Yearly", value: "YEARLY")
end
