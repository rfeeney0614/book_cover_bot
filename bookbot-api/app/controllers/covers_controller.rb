class CoversController < ApplicationController
  def index
    page = [params[:page].to_i, 1].max
    @per_page = 15
    offset = (page - 1) * @per_page
    @covers = Cover.search(params[:search]).limit(@per_page).offset(offset)
  end

  def new
    @book = Book.find(params[:book_id])
    @cover = Cover.new
  end

  def create
    @book = Book.find(params[:book_id])
    @cover = @book.covers.create(cover_params)
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
    @show_page_count = params[:show_page_count]

    respond_to do |format|
      format.html do
        redirect_back fallback_location: cover_path
      end

      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          @cover, # translates to same identifier as dom_id(invoice)
          partial: 'covers/cover',
          locals: { cover: @cover, show_page_count: @show_page_count },
        )
      end
    end
  end

  def remove_job
    @cover = Cover.find(params[:id])
    @cover.remove_job
    @show_page_count = params[:show_page_count]

    respond_to do |format|
      format.html do
        redirect_back fallback_location: cover_path
      end

      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          @cover, # translates to same identifier as dom_id(invoice)
          partial: 'covers/cover',
          locals: { cover: @cover, show_page_count: @show_page_count },
        )
      end
    end
  end

  private
    def cover_params
      params.require(:cover).permit(:edition, :format_id, :image, :note)
    end
end
