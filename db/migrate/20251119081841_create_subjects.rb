class CreateSubjects < ActiveRecord::Migration[8.0]
  def change
    create_table :subjects do |t|
      t.string :subject_id
      t.string :subject_name

      t.timestamps
    end
  end
end
