class AddPrintExport < ActiveRecord::Migration[8.0]
  def change
    create_table :print_exports do |t|
      t.boolean :finished

      t.timestamps
    end
    change_table :job_orders do |t|
      t.references :print_export, index: true
    end
  end
end
