class PrintExport < ApplicationRecord
  has_one_attached :pdf
  has_many :job_orders
end
