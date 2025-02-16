class AddPrintExport < ActiveRecord::Migration[8.0]
  def change
    create_table :print_exports do |t|
      t.boolean :finished

      t.timestamps
    end
    add_column :job_orders, :print_export_id, :integer, references: :print_exports
  end
end
