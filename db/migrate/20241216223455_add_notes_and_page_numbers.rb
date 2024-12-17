class AddNotesAndPageNumbers < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :page_count, :integer
    add_column :books, :note, :text
  end
end
