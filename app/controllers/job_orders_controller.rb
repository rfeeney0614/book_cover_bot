class JobOrdersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :export
  def index
    @jobs = JobOrder.all
  end

  def export
    @ex = PrintExport.create
    @ex.job_orders.append(JobOrder.all)
    @ex.save
    CompileExportJob.perform_later(ex.id)
    respond_to do |format|
       format.json { render :json => {:jobId => @ex.id} }
    end

  end

  def clear
    JobOrder.delete_all
    redirect_back fallback_location: print_queue_path
  end
end
