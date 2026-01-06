class StopwatchRecord < ApplicationRecord
  belongs_to :user

  validates :elapsed_seconds, numericality: { greater_than_or_equal_to: 0 }
end
