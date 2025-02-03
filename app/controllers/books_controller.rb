class BooksController < ApplicationController
  def index
    page = [params[:page].to_i, 1].max
    @per_page = 10
    offset = (page - 1) * @per_page
    @books = Book.search(params[:search]).limit(@per_page).offset(offset)
  end

  def show
    @book = Book.find(params[:id])
  end

  def new
    @book = Book.new
  end

  def create
    @book = Book.new(book_params)

    if @book.save
      redirect_to @book
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
   @book = Book.find(params[:id])
  end

  def update
    @book = Book.find(params[:id])

    if @book.update(book_params)
      redirect_to @book
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @book = Book.find(params[:id])
    @book.destroy

    redirect_to root_path, status: :see_other
  end

  private
  def book_params
    params.expect(book: [:title, :author, :note, :page_count])
  end
end
