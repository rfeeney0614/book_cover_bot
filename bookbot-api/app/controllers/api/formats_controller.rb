module Api
  class FormatsController < ApplicationController
    protect_from_forgery with: :null_session

    before_action :set_format, only: [:show, :update, :destroy]

    def index
      formats = Format.all.limit(100)
      render json: formats.as_json
    end

    def show
      render json: @format
    end

    def create
      @format = Format.new(format_params)
      if @format.save
        render json: @format, status: :created
      else
        render json: { errors: @format.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      Rails.logger.info("Api::FormatsController#update called with params: #{params.to_unsafe_h.inspect}")
      Rails.logger.info("Resolved format_params: #{format_params.inspect}")
      if @format.update(format_params)
        Rails.logger.info("Format ##{@format.id} updated successfully: #{@format.attributes.inspect}")
        render json: @format
      else
        Rails.logger.warn("Failed to update Format ##{@format.id}: #{@format.errors.full_messages.inspect}")
        render json: { errors: @format.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @format.destroy
      head :no_content
    end

    private

    def set_format
      @format = Format.find(params[:id])
    end

    def format_params
      # Accept either nested params (`format: { ... }`) or top-level params.
      if params[:format]
        params.require(:format).permit(:name, :height, :default)
      else
        params.permit(:name, :height, :default)
      end
    end
  end
end
