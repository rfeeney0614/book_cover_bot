class PrintExport < ApplicationRecord
  has_one_attached :pdf
  has_many :job_orders

  def status
    return 'completed' if finished
    return 'processing' if pdf.attached?
    'pending'
  end
end
