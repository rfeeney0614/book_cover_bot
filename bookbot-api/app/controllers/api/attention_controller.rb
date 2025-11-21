module Api
  class AttentionController < ApplicationController
    protect_from_forgery with: :null_session

    def index
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || 20).to_i
      offset = (page - 1) * per_page
      filter_type = params[:type]

      attention_items = []

      # Find covers without images
      if filter_type.nil? || filter_type == 'all' || filter_type == 'cover_missing_image'
        covers_without_images = Cover.left_joins(:image_attachment)
                                     .where(active_storage_attachments: { id: nil })
                                     .includes(:book, :format)

        covers_without_images.each do |cover|
          attention_items << {
            type: 'cover_missing_image',
            id: cover.id,
            title: "Cover missing image",
            description: "#{cover.book&.title || 'Unknown book'} - #{cover.edition || 'No edition'}",
            cover_id: cover.id,
            book_id: cover.book_id,
            link: "/covers/#{cover.id}"
          }
        end
      end

      # Find books without covers
      if filter_type.nil? || filter_type == 'all' || filter_type == 'book_missing_covers'
        books_without_covers = Book.left_joins(:covers)
                                   .where(covers: { id: nil })

        books_without_covers.each do |book|
          attention_items << {
            type: 'book_missing_covers',
            id: book.id,
            title: "Book missing covers",
            description: "#{book.title} by #{book.author}",
            book_id: book.id,
            link: "/books/#{book.id}"
          }
        end
      end

      # Calculate counts by category (always for all items)
      all_category_counts = {}
      
      # Count covers without images
      covers_count = Cover.left_joins(:image_attachment)
                          .where(active_storage_attachments: { id: nil })
                          .count
      all_category_counts['cover_missing_image'] = covers_count if covers_count > 0
      
      # Count books without covers
      books_count = Book.left_joins(:covers)
                        .where(covers: { id: nil })
                        .count
      all_category_counts['book_missing_covers'] = books_count if books_count > 0

      total_all_count = all_category_counts.values.sum
      filtered_count = attention_items.count
      paginated_items = attention_items.slice(offset, per_page) || []

      render json: { 
        items: paginated_items, 
        count: filtered_count,
        total_count: total_all_count,
        category_counts: all_category_counts,
        page: page,
        per_page: per_page,
        total_pages: (filtered_count.to_f / per_page).ceil
      }
    end
  end
end
