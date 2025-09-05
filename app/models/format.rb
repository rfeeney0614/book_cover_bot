
class Format < ApplicationRecord
  before_save :unset_other_defaults, if: :default?

  def self.default
    Format.where(default: true).first || Format.first
  end

  private

  def unset_other_defaults
    if default_changed? && default
      Format.where.not(id: id).where(default: true).update_all(default: false)
    end
  end
end
