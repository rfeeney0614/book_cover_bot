class JobOrdersController < ApplicationController
  def index
    @jobs = JobOrder.all
  end

  def export
    @export = PrintExport.create
    @export.job_orders.append(JobOrder.all)
    CompileExportJob.perform_later(export.id)
    respond_to do |format|
       format.html { render :json => {:jobId => @export.id} }
    end

  end

  def clear
    JobOrder.delete_all
    redirect_back fallback_location: print_queue_path
  end
end
