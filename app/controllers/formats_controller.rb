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
