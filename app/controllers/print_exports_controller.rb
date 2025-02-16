class PrintExportsController < ApplicationController
  def index
    @jobs = JobOrder.all
  end

  def status
    @export = PrintExport.find(params[:id])
    if @export.finished
      render :status => :ok
    else
      render :status => :accepted
    end
  end

  def download
    @export = PrintExport.find(params[:id])
    redirect_to rails_blob_path(@export.pdf, disposition: "attachment", only_path: true)
  end
end
