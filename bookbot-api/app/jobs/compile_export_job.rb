class CompileExportJob < ApplicationJob
  queue_as :default

  def perform(export_id)
    export = PrintExport.find(export_id)
    begin
      io = PrintJobCompiler.generate(export.job_orders, export)
      export.pdf.attach(io: io, filename: "print_#{DateTime.now}.pdf")
      export.progress_text = "Saving PDF..."
      export.save
      export.finished = true
      export.progress_text = nil
      export.save
    rescue => e
      Rails.logger.error "CompileExportJob failed: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      export.error_message = "Export failed: #{e.message}"
      export.progress_text = nil
      export.save
      raise e
    end
  end
end
