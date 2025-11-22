class AddConstructionModelOverrideToCovers < ActiveRecord::Migration[8.0]
  def change
    add_column :covers, :construction_model_override, :integer
  end
end
