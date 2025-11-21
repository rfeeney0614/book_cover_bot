class AddJobOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :job_orders do |t|
      t.integer :quantity
      t.references :cover, null: false, foreign_key: true

      t.timestamps
    end
  end
end
