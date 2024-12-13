require 'hexapdf'
class PrintJobCompiler
  def self.generate
    # Image only added to PDF once though used multiple times
    # canvas = doc.pages.add.canvas
    # canvas.image(file, at: [100, 500]) # auto-size based on image size
    # canvas.image(file, at: [100, 300], width: 100) # height based on w/h ratio
    # canvas.image(file, at: [300, 300], height: 100) # width based on w/h ratio
    # canvas.image(file, at: [100, 100], width: 300, height: 100)
    tmp_user_folder = "tmp/archive"
    FileUtils.mkdir_p(tmp_user_folder) unless Dir.exist?(tmp_user_folder)

    io = StringIO.new
    HexaPDF::Composer.create('images.pdf') do |composer|
      jobs = JobOrder.all
      jobs.each do |job|
        filename = job.cover.image.blob.filename.to_s
        format = job.cover.format
        create_tmp_folder_and_store_documents(job.cover.image, tmp_user_folder, filename)
        file = File.join(tmp_user_folder, filename)
        job.quantity.times do
          composer.image(file, width: format.width, height: format.height, position: :float, margin: [5, 5, 5, 5]) # fill current rectangular region
        end
      end
      # Add the page created above as second page
      composer.document.write(io)
    end
    io.rewind
    FileUtils.rm_rf([tmp_user_folder])
    io
  end

  def self.create_tmp_folder_and_store_documents(document, tmp_user_folder, filename)
    File.open(File.join(tmp_user_folder, filename), 'wb') do |file|
     document.download { |chunk| file.write(chunk) }
   end
  end
end
