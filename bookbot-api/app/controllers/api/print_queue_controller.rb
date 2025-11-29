class Api::PrintQueueController < ApplicationController
  def index
    # Get all covers that have job orders (quantity > 0)
    @covers = Cover.joins(:job_order, :book)
                   .includes(:book, :format, :job_order, image_attachment: :blob)
                   .where('job_orders.quantity > 0')
    
    # Apply secondary sorting based on params
    sort_by = params[:sort_by] || 'date_added'
    @covers = case sort_by
              when 'model_number'
                # Load records first, then sort by construction_model method in Ruby
                @covers.to_a.sort_by { |c| c.construction_model.to_s }
              when 'book_title'
                @covers.order('books.title ASC')
              when 'date_added'
                @covers.order('job_orders.created_at ASC')
              else
                @covers.order('job_orders.created_at ASC')
              end

    covers_data = @covers.map do |cover|
      {
        id: cover.id,
        edition: cover.edition,
        note: cover.note,
        book_id: cover.book_id,
        book_title: cover.book.title,
        book_author: cover.book.author,
        format_id: cover.format_id,
        format_name: cover.format&.name,
        construction_model: cover.construction_model,
        print_quantity: cover.job_order.quantity,
        job_order_id: cover.job_order.id,
        image_url: cover.image.attached? ? url_for(cover.image) : nil,
        thumb_url: cover.image.attached? ? url_for(cover.image.variant(:thumb)) : nil,
        created_at: cover.job_order.created_at
      }
    end

    render json: { print_queue: covers_data }
  end
end
