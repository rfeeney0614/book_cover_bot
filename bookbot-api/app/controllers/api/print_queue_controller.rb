class Api::PrintQueueController < ApplicationController
  def index
    # Get all covers that have job orders (quantity > 0)
    @covers = Cover.joins(:job_order, :book)
                   .includes(:book, :format, :job_order, image_attachment: :blob)
                   .where('job_orders.quantity > 0')
                   .order('job_orders.created_at DESC')

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
        thumb_url: cover.image.attached? ? url_for(cover.image.variant(:thumb)) : nil
      }
    end

    render json: { print_queue: covers_data }
  end
end
