require 'hexapdf'
require 'image_size'
require 'rmagick'
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
        width, height = 0,0
      jobs = JobOrder.all
      jobs.each do |job|
        filename = job.cover.image.blob.filename.to_s
        create_tmp_folder_and_store_documents(job.cover.image, tmp_user_folder, filename)
        file = File.join(tmp_user_folder, filename)
        image_size = ImageSize.path(file)
        image = Magick::Image.read(file).first
        width, height = image.columns, image.rows
        # if width > composer.frame.available_width  && composer.frame.available_width > height
          scale = job.cover.format.height * 72 / image_size.height
          width, height = image_size.width * scale, image_size.height * scale
          # image = image.resize_to_fit(height * scale, width * scale)
          # width, height = image.columns, image.rows

          rotated_file = File.join(tmp_user_folder, 'rotation')
          image.rotate(90).write(rotated_file)


        # end
        job.quantity.times do
          # raise "available_width: #{composer.frame.available_width}"
          h = height
          w = width
          target_image = file
          if width > composer.frame.available_width && height < composer.frame.available_width
            w, h = h, w
            target_image = rotated_file
          end
          composer.image(target_image, height: h, width: w, position: :flow, margin: [2, 2, 2, 2]) # fill current rectangular region                 # Positive x-axis pointing to top-right corner
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
