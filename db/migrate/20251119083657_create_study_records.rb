class CreateStudyRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :study_records do |t|
      t.string :user_id
      t.string :subject_id
      t.date :date
      t.datetime :start_time
      t.datetime :end_time
      t.integer :duration_seconds
      t.string :content
      t.boolean :is_completed

      t.timestamps
    end
  end
end
