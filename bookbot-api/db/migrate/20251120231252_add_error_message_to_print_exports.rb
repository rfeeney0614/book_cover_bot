class AddErrorMessageToPrintExports < ActiveRecord::Migration[8.0]
  def change
    add_column :print_exports, :error_message, :text
  end
end
