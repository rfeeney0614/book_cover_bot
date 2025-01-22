class Book < ApplicationRecord
  validates :title, presence: true
  has_many :covers, dependent: :destroy

  def self.search(query)
    if query
      key = "%#{query}%"

      Book.where('title LIKE :search OR author LIKE :search', search: key).order(:title)
      # Book.where(Book.arel_table[:title].matches("%#{query}%"))
    else
      Book.all
    end
  end
end
