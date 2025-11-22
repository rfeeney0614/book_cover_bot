module Api
  class JobOrdersController < BaseController
    before_action :set_job_order, only: [:show, :destroy, :increment, :decrement]

    def index
      job_orders = JobOrder.includes(cover: [:book, :format, image_attachment: :blob]).order(created_at: :desc).limit(200)
      
      items = job_orders.map do |job_order|
        cover = job_order.cover
        image_url = cover.image.attached? ? url_for(cover.image) : nil
        thumb_url = cover.image.attached? ? (url_for(cover.image.variant(:thumb)) rescue image_url) : nil
        
        {
          id: cover.id,
          job_order_id: job_order.id,
          book_title: cover.book&.title,
          book_author: cover.book&.author,
          edition: cover.edition,
          format_name: cover.format&.name,
          construction_model: cover.construction_model,
          print_quantity: job_order.quantity,
          image_url: image_url,
          thumb_url: thumb_url
        }
      end
      
      render json: items
    end

    def show
      render json: @job_order
    end

    def create
      @job_order = JobOrder.new(job_order_params)
      if @job_order.save
        render json: @job_order, status: :created
      else
        render_errors(@job_order)
      end
    end

    def increment
      @job_order.quantity += 1
      if @job_order.save
        render json: { id: @job_order.id, quantity: @job_order.quantity }
      else
        render_errors(@job_order)
      end
    end

    def decrement
      @job_order.quantity -= 1
      if @job_order.quantity <= 0
        @job_order.destroy
        render json: { id: @job_order.id, quantity: 0, deleted: true }
      elsif @job_order.save
        render json: { id: @job_order.id, quantity: @job_order.quantity }
      else
        render_errors(@job_order)
      end
    end

    def destroy
      @job_order.destroy
      head :no_content
    end

    private

    def set_job_order
      @job_order = JobOrder.find(params[:id])
    end

    def job_order_params
      params.require(:job_order).permit(:note, :cover_id, :quantity)
    end
  end
end
