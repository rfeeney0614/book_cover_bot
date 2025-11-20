class FixDefaultColumnTypeOnFormats < ActiveRecord::Migration[8.0]
  def up
    # Remove the incorrect binary column
    remove_column :formats, :default
    # Add the correct boolean column
    add_column :formats, :default, :boolean, default: false, null: false
  end

  def down
    # Rollback: remove boolean and add binary (not recommended, but for completeness)
    remove_column :formats, :default
    add_column :formats, :default, :binary, default: false, null: false
  end
end
