class ScheduledTransaction < ApplicationRecord
  PERIODS = %w[WEEKLY BIWEEKLY MONTHLY MONTHLYx2].freeze
  WEEKEND_ADJUSTS = %w[NONE BEFORE AFTER CLOSEST].freeze

  belongs_to :account

  enum :period, PERIODS.zip(PERIODS).to_h
  enum :weekend_adjust, WEEKEND_ADJUSTS.zip(WEEKEND_ADJUSTS).to_h
end
