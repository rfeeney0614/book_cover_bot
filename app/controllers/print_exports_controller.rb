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
    redirect_to @export.pdf.service_url
  end
end
