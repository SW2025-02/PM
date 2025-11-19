class CreateStopwatchRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :stopwatch_records do |t|
      t.string :user_id
      t.string :subject_id
      t.string :start_time
      t.string :datetime
      t.datetime :pause_time
      t.integer :elapsed_seconds
      t.boolean :is_running
      t.datetime :last_started_at

      t.timestamps
    end
  end
end
