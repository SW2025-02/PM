class StopwatchRecord < ApplicationRecord
  belongs_to :user
  belongs_to :subject, optional: true

  validates :elapsed_seconds, numericality: { greater_than_or_equal_to: 0 }
end
