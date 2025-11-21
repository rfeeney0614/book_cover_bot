
class Format < ApplicationRecord
  has_many :construction_mappings, dependent: :destroy

  before_save :unset_other_defaults, if: :default?

  def self.default
    Format.where(default: true).first || Format.first
  end

  def construction_model_for_pages(page_count)
    return nil if page_count.nil?

    mapping = construction_mappings.find do |m|
      page_count >= m.min_pages && page_count <= m.max_pages
    end

    mapping&.construction_model
  end

  private

  def unset_other_defaults
    if default_changed? && default
      Format.where.not(id: id).where(default: true).update_all(default: false)
    end
  end
end
