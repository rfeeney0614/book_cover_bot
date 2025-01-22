class Format < ApplicationRecord
  def self.default
    Format.find('name == Minibook')
  end
end
