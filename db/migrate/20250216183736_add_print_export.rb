class AddPrintExport < ActiveRecord::Migration[8.0]
  def change
    create_table :print_exports do |t|
      t.boolean :finished

      t.timestamps
    end

    add_referance :job_orders, :print_export, null: true, foreign_key: true
  end
end
