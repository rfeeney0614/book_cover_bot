class CreateConstructionMappings < ActiveRecord::Migration[8.0]
  def change
    create_table :construction_mappings do |t|
      t.references :format, null: false, foreign_key: true
      t.integer :min_pages, null: false
      t.integer :max_pages, null: false
      t.integer :construction_model, null: false

      t.timestamps
    end

    add_index :construction_mappings, [:format_id, :min_pages, :max_pages], name: 'index_construction_mappings_on_format_and_pages'
  end
end
