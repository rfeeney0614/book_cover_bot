class CreateCovers < ActiveRecord::Migration[8.0]
  def change
    create_table :covers do |t|
      t.string :edition
      t.string :format

      t.timestamps
    end
  end
end
