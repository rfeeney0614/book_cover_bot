class CoversController < ApplicationController
  def index
    @covers = Cover.search(params[:search])
  end

  def new
    @book = Book.find(params[:book_id])
    @cover = Cover.new
  end

  def create
    @book = Book.find(params[:book_id])
    @comment = @book.covers.create(cover_params)
    redirect_to book_path(@book)
  end

  def edit
   @cover = Cover.find(params[:id])
  end

  def update
    @cover = Cover.find(params[:id])

    if @cover.update(cover_params)
      redirect_to params[:previous_request]
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @cover = Cover.find(params[:id])
    @cover.destroy

    respond_to do |format|
      format.html do
        redirect_back fallback_location: cover_path
      end

      format.turbo_stream do
        render turbo_stream: turbo_stream.remove(@cover)
      end
    end
  end

  def add_job
    @cover = Cover.find(params[:id])
    @cover.add_job

    respond_to do |format|
      format.html do
        redirect_back fallback_location: cover_path
      end

      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          @cover, # translates to same identifier as dom_id(invoice)
          partial: 'covers/cover',
          locals: { cover: @cover },
        )
      end
    end
  end

  def remove_job
    @cover = Cover.find(params[:id])
    @cover.remove_job

    respond_to do |format|
      format.html do
        redirect_back fallback_location: cover_path
      end

      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          @cover, # translates to same identifier as dom_id(invoice)
          partial: 'covers/cover',
          locals: { cover: @cover },
        )
      end
    end
  end

  private
    def cover_params
      params.expect(cover: [:edition, :format_id, :image])
    end
end
