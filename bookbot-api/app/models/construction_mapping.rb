class ConstructionMapping < ApplicationRecord
  belongs_to :format

  validates :min_pages, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :max_pages, presence: true, numericality: { greater_than: :min_pages }
  validates :construction_model, presence: true, numericality: { greater_than: 0 }

  validate :no_overlapping_ranges

  private

  def no_overlapping_ranges
    return if format_id.nil?

    overlapping = ConstructionMapping
      .where(format_id: format_id)
      .where.not(id: id)
      .where('(min_pages <= ? AND max_pages >= ?) OR (min_pages <= ? AND max_pages >= ?)', 
             min_pages, min_pages, max_pages, max_pages)

    if overlapping.exists?
      errors.add(:base, 'Page range overlaps with existing mapping')
    end
  end
end
