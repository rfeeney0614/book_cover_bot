class JobOrdersController < ApplicationController
  def index
    @jobs = JobOrder.all
  end

  def export
    io = PrintJobCompiler.generate
    send_data(
      io.read,
      filename: "book_cover_prints_#{DateTime.now}.pdf",
      type: 'application/pdf'
    )
  end
end
