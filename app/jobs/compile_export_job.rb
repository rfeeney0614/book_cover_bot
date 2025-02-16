class CompileExportJob < ApplicationJob
  queue_as :default

  def perform(export_id)
    export = PrintExport.find(export_id)
    io = PrintJobCompiler.generate(JorOrders.all)
    export.pdf.attach(io: io.read)
    export.finished = true
    export.save
  end
end
