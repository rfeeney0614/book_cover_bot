class AddProgressTextToPrintExports < ActiveRecord::Migration[8.0]
  def change
    add_column :print_exports, :progress_text, :string
  end
end
