class UpdateFormat < ActiveRecord::Migration[8.0]
  def change
    remove_column :formats, :width
    change_column :formats, :height, :float
  end
end
