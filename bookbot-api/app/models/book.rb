class Book < ApplicationRecord
  include PgSearch::Model
  
  validates :title, presence: true
  has_many :covers, dependent: :destroy

  pg_search_scope :search_by_all_fields,
    against: {
      title: 'A',
      author: 'B',
      series: 'C'
    },
    using: {
      tsearch: {
        prefix: true,
        dictionary: 'english'
      },
      trigram: {
        threshold: 0.05
      }
    },
    ranked_by: ":trigram * 3 + :tsearch"

  def self.search(query)
    return Book.all if query.blank?
    
    # Filter out single-character terms for better results
    cleaned_query = query.split.reject { |term| term.length == 1 }.join(' ')
    return Book.all if cleaned_query.blank?
    
    search_by_all_fields(cleaned_query)
  end
end
