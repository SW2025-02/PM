class RemoveIndexFromUsersEmail < ActiveRecord::Migration[8.0]
  def change
    remove_index :users, :email
  end
end
