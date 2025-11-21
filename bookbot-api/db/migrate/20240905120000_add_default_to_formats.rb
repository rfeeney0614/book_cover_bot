class AddDefaultToFormats < ActiveRecord::Migration[8.0]
  def change
    add_column :formats, :default, :binary, default: false, null: false
  end
end
