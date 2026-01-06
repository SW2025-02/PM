class FixSubjectsInStopwatchAndStudy < ActiveRecord::Migration[8.0]
  def change
    # stopwatch_records
    remove_column :stopwatch_records, :subject_id, :string
    add_column    :stopwatch_records, :subject, :string

    # study_records
    remove_column :study_records, :subject_id, :string
    add_column    :study_records, :subject, :string
    add_column    :study_records, :memo, :text
  end
end
