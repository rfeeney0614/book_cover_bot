class CompileExportJob < ApplicationJob
  queue_as :default

  def perform(export_id)
    export = PrintExport.find(export_id)
    io = PrintJobCompiler.generate(export.job_orders)
    export.pdf.attach(io: io.read, filename: "export_#{DateTime.now}")
    export.finished = true
    export.save
  end
end
