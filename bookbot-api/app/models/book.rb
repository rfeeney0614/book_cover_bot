class Book < ApplicationRecord
  validates :title, presence: true
  has_many :covers, dependent: :destroy

  def self.search(query)
    return Book.all if query.blank?

    sanitized_query = query.downcase.strip
    return Book.all if sanitized_query.empty?

    # Split into terms for multi-field matching
    terms = sanitized_query.split(/\s+/).reject(&:blank?)
    
    # Build conditions - each term must match at least one field
    where_parts = []
    where_values = []
    
    terms.each do |term|
      like_term = "%#{sanitize_sql_like(term)}%"
      where_parts << "(lower(books.title) LIKE ? OR lower(COALESCE(books.author, '')) LIKE ? OR lower(COALESCE(books.series, '')) LIKE ?)"
      where_values += [like_term, like_term, like_term]
    end
    
    # Add trigram similarity for typo tolerance - lowered threshold to 0.2 for better fuzzy matching
    where_parts << "similarity(lower(books.title), ?) > 0.2"
    where_parts << "similarity(lower(COALESCE(books.author, '')), ?) > 0.2"
    where_parts << "similarity(lower(COALESCE(books.series, '')), ?) > 0.2"
    where_values += [sanitized_query, sanitized_query, sanitized_query]
    
    Book.where(where_parts.join(' OR '), *where_values).order(:title)
  end
end
