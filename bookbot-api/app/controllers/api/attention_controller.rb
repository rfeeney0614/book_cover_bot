module Api
  class AttentionController < ApplicationController
    protect_from_forgery with: :null_session

    def index
      attention_items = []

      # Find covers without images
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

      # Find books without covers
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

      render json: { items: attention_items, count: attention_items.count }
    end
  end
end
