class AddSeriesToBook < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :series, :text
  end
end
