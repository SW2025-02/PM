class DropSubjects < ActiveRecord::Migration[8.0]
  def change
    drop_table :subjects
  end
end
