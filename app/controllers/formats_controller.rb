class FormatsController < ApplicationController
  def index
    @formats = Format.all
  end

  def show
    @format = Format.find(params[:id])
  end

  def new
    @format = Format.new
  end

  def edit
   @format = Format.find(params[:id])
  end

  def update
    @format = Format.find(params[:id])

    if @format.update(format_params)
      redirect_to action: "index"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @format = Format.find(params[:id])
    @format.destroy

    respond_to do |response_format|
      response_format.html do
        redirect_back fallback_location: format_path
      end

      response_format.turbo_stream do
        render turbo_stream: turbo_stream.remove(@format)
      end
    end
  end

  def create
    @format = Format.new(format_params)

    if @format.save
      redirect_to action: "index"
    else
      render :new, status: :unprocessable_entity
    end
  end

  private
  def format_params
    params.expect(format: [:name, :height])
  end
end
