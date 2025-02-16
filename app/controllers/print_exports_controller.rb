class PrintExportsController < ApplicationController
  def index
    @jobs = JobOrder.all
  end

  def status
    @export = PrintExport.find(params[:id])
    render :json => {:finished => @export.finished}
  end

  def download
    @export = PrintExport.find(params[:id])
    redirect_to rails_blob_path(@export.pdf, disposition: "attachment", only_path: true)
  end
end
