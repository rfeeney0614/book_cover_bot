class Book < ApplicationRecord
  validates :title, presence: true
  has_many :covers, dependent: :destroy
end
