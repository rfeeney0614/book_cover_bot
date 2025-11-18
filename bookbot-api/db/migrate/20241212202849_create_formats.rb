class CreateFormats < ActiveRecord::Migration[8.0]
  def change
    create_table :formats do |t|
      t.string :name
      t.integer :width
      t.integer :height

      t.timestamps
    end
    remove_column :covers, :format
    add_reference :covers, :format, null: false, foreign_key: true
  end
end
