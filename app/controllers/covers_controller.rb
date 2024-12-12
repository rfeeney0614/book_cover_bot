class CoversController < ApplicationController
  def create
    @book = Book.find(params[:book_id])
    @comment = @book.covers.create(cover_params)
    redirect_to book_path(@book)
  end

  private
    def cover_params
      params.expect(cover: [:edition, :format, :image])
    end
end
