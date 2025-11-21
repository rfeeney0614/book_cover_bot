class AddCovers < ActiveRecord::Migration[8.0]
  def change
    add_reference :covers, :book, null: false, foreign_key: true
  end
end
