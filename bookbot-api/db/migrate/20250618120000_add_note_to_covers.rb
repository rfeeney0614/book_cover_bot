class AddNoteToCovers < ActiveRecord::Migration[8.0]
  def change
    add_column :covers, :note, :text
  end
end
