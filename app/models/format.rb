class Format < ApplicationRecord
  def self.default
    Format.where('name == Minibook')
  end
end
