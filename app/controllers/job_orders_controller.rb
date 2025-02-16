class JobOrdersController < ApplicationController
  def index
    @jobs = JobOrder.all
  end

  def export
    @export = PrintExport.create
    # JobOrder.all.each do |job|
    #   job.print_export = @export
    #   job.save
    # end
    CompileExportJob.perform_later(export.id)
    respond_to do |format|
       format.json { render :json => {:jobId => @export.id} }
       format.js   { render :layout => false }
    end
  end

  def clear
    JobOrder.delete_all
    redirect_back fallback_location: print_queue_path
  end
end
