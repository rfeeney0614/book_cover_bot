class AllowNullableFormatOnCovers < ActiveRecord::Migration[8.0]
  def change
    change_column_null(:covers, :format_id, true)
  end
end
