class Cover < ApplicationRecord
  has_one_attached :image do |attachable|
    attachable.variant :thumb, resize_to_limit: [100, 100]
  end
  belongs_to :book
  belongs_to :format, optional: true
  has_one :job_order, dependent: :destroy

  def job_count
    return 0 unless job_order.present?
    return job_order.quantity
  end

  def self.search(query)
    if query
      Book.search(query).map { |b| b.covers }.flatten
    else
      all
    end
  end

  def add_job
    if job_order.present?
      job_order.quantity += 1
      job_order.save
    else
      @job_order = JobOrder.create(quantity: 1, cover: self)
      save
    end
  end

  def remove_job
    return unless job_order.present?
    job_order.quantity -= 1
    if job_order.quantity <= 0
      job_order.destroy
    end
    job_order.save
  end
end
