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
    images_to_pack = []

    width, height = 0,0
    jobs = JobOrder.all
    jobs.each do |job|
      filename = job.cover.image.blob.filename.to_s
      create_tmp_folder_and_store_documents(job.cover.image, tmp_user_folder, filename)
      file = File.join(tmp_user_folder, filename)
      save_rotated_image(tmp_user_folder, filename)
      image_size = ImageSize.path(file)
      scale = job.cover.format.height * 72 / image_size.height
      width, height = image_size.width * scale, image_size.height * scale
      job.quantity.times do |i|
        images_to_pack << Binpack::Item.new(file, width + 2, height + 2)
      end
    end
    bins = Binpack::Bin.pack(images_to_pack, [], Binpack::Bin.new(595, 842, 10))

    # Add the page created above as second page
    #
    HexaPDF::Composer.create('images.pdf', margin: 10) do |composer|
      bins.each_with_index do |bin, index|
        bin.items.sort_by { |b| [b[2], b[1]] }.each do |item|
          image = item[0]
          image_file = image.obj
          if image.rotated
            image_file = get_rotated_image(tmp_user_folder, image_file)
          end
          composer.image(image_file, height: image.height - 2, width: image.width - 2, position: :float, margin: [2,2,2,2])
        end
      end
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

  def self.save_rotated_image(folder, filename)
    file = File.join(folder, filename)
    image = Magick::Image.read(file).first
    ext = File.extname(filename)
    rotated_file = File.join(folder, File.basename(filename, ext) + 'rotated' + ext )
    image.rotate(90).write(rotated_file)
  end

  def self.get_rotated_image(folder, filename)
    ext = File.extname(filename)
    File.join( folder, File.basename(filename, ext) + 'rotated' + ext )
  end
end
