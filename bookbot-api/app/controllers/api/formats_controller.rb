module Api
  class FormatsController < ApplicationController
    protect_from_forgery with: :null_session

    before_action :set_format, only: [:show, :update, :destroy]

    def index
      formats = Format.all.limit(100)
      render json: formats
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
      if @format.update(format_params)
        render json: @format
      else
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
      params.expect(format: [:name, :height])
    end
  end
end
