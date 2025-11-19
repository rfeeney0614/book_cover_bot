module Api
  class JobOrdersController < ApplicationController
    protect_from_forgery with: :null_session

    before_action :set_job_order, only: [:show, :destroy]

    def index
      job_orders = JobOrder.order(created_at: :desc).limit(200)
      render json: job_orders
    end

    def show
      render json: @job_order
    end

    def create
      @job_order = JobOrder.new(job_order_params)
      if @job_order.save
        render json: @job_order, status: :created
      else
        render json: { errors: @job_order.errors.full_messages }, status: :unprocessable_entity
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
      params.require(:job_order).permit(:note)
    end
  end
end
