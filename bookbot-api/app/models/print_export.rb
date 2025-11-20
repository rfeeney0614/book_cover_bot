class PrintExport < ApplicationRecord
  has_one_attached :pdf
  has_many :job_orders

  def status
    return 'failed' if error_message.present?
    return 'completed' if finished
    return 'processing' if pdf.attached? || progress_text.present?
    'pending'
  end
end
