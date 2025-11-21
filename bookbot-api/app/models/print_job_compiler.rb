require 'hexapdf'
require 'image_size'
require 'rmagick'
class PrintJobCompiler
  def self.generate(jobs, export = nil)
    start_time = Time.now
    puts "[PrintJobCompiler] Starting generation for #{jobs.count} jobs"
    
    if export
      export.progress_text = "Preparing export..."
      export.save
    end
    
    tmp_user_folder = "tmp/archive"
    FileUtils.mkdir_p(tmp_user_folder) unless Dir.exist?(tmp_user_folder)

    io = StringIO.new
    images_to_pack = []
    
    # Track downloaded files to avoid re-downloading the same cover
    downloaded_files = {}

    width, height = 0,0
    download_time = 0
    rotate_time = 0
    
    # Collect unique covers to download
    unique_jobs = jobs.uniq { |job| job.cover.id }
    
    if export
      export.progress_text = "Downloading #{unique_jobs.count} cover images..."
      export.save
    end
    
    # Download all unique covers in parallel
    d_start = Time.now
    download_threads = unique_jobs.map do |job|
      Thread.new do
        filename = job.cover&.image&.blob&.filename&.to_s
        next if filename.nil?
        
        create_tmp_folder_and_store_documents(job.cover.image, tmp_user_folder, filename)
        
        file = File.join(tmp_user_folder, filename)
        image_size = ImageSize.path(file)
        scale = job.cover.format.height * 72 / image_size.height
        width = image_size.width * scale
        height = image_size.height * scale
        
        [job.cover.id, { file: file, width: width, height: height }]
      end
    end
    
    # Wait for all downloads to complete and build the cache
    completed_downloads = 0
    download_threads.each do |thread|
      result = thread.value
      if result
        downloaded_files[result[0]] = result[1]
        completed_downloads += 1
        if export
          export.progress_text = "Downloaded #{completed_downloads}/#{unique_jobs.count} cover images..."
          export.save
        end
      end
    end
    download_time = Time.now - d_start
    
    if export
      export.progress_text = "Processing covers for PDF..."
      export.save
    end
    
    # Now build the images_to_pack array using the cached data
    jobs.each do |job|
      cover_id = job.cover.id
      cached = downloaded_files[cover_id]
      next unless cached
      
      job.quantity.times do |i|
        images_to_pack << Binpack::Item.new(cached[:file], cached[:width] + 2, cached[:height] + 2)
      end
    end
    
    pack_start = Time.now
    bins = Binpack::Bin.pack(images_to_pack, [], Binpack::Bin.new(612, 792, 10))
    pack_time = Time.now - pack_start
    
    if export
      export.progress_text = "Generating PDF with #{images_to_pack.count} images..."
      export.save
    end
    
    puts "[PrintJobCompiler] Download time: #{download_time.round(2)}s"
    puts "[PrintJobCompiler] Rotate time: #{rotate_time.round(2)}s"
    puts "[PrintJobCompiler] Pack time: #{pack_time.round(2)}s"

    # Add the page created above as second page
    #
    pdf_start = Time.now
    pdf_path = File.join(tmp_user_folder, 'images.pdf')
    rotated_cache = {} # Cache rotated images to avoid rotating the same file multiple times
    
    puts "[PrintJobCompiler] Creating PDF with #{images_to_pack.count} image instances from #{downloaded_files.count} unique files"
    
    HexaPDF::Composer.create(pdf_path, page_size: :Letter, margin: 10) do |composer|
      processed_images = 0  # Move counter outside the bins loop
      bins.each_with_index do |bin, index|
        bin.items.sort_by { |b| [b[2], b[1]] }.each do |item|
          image = item[0]
          image_file = image.obj
          if image.rotated
            # Rotate on-demand and cache the result
            unless rotated_cache[image_file]
              r_start = Time.now
              rotated_cache[image_file] = create_rotated_image(tmp_user_folder, image_file)
              rotate_time += (Time.now - r_start)
            end
            image_file = rotated_cache[image_file]
          end
          composer.image(image_file, height: image.height - 2, width: image.width - 2, position: :float, margin: [2,2,2,2])
          
          processed_images += 1
          # Update progress every 5 images or on last image
          if export && (processed_images % 5 == 0 || processed_images == images_to_pack.count)
            export.progress_text = "Processing #{processed_images}/#{images_to_pack.count} images..."
            export.save
          end
        end
      end
      composer.document.write(io)
      
      # Check how many unique image XObjects are in the PDF
      image_xobjects = composer.document.each(only_current: false).select { |obj| 
        obj.kind_of?(Hash) && obj[:Subtype] == :Image 
      }
      puts "[PrintJobCompiler] PDF contains #{image_xobjects.count} unique image objects (should equal unique source files if HexaPDF is deduplicating)"
    end
    pdf_time = Time.now - pdf_start
    
    puts "[PrintJobCompiler] PDF generation time: #{pdf_time.round(2)}s"
    puts "[PrintJobCompiler] Total time: #{(Time.now - start_time).round(2)}s"
    
    io.rewind
    FileUtils.rm_rf([tmp_user_folder])
    io
  end

  def self.create_tmp_folder_and_store_documents(document, tmp_user_folder, filename)
    File.open(File.join(tmp_user_folder, filename), 'wb') do |file|
     document.download { |chunk| file.write(chunk) }
   end
  end

  def self.create_rotated_image(folder, filename)
    file = File.join(folder, filename)
    image = Magick::Image.read(file).first
    ext = File.extname(filename)
    rotated_file = File.join(folder, File.basename(filename, ext) + 'rotated' + ext)
    image.rotate(90).write(rotated_file)
    rotated_file
  end

  def self.save_rotated_image(folder, filename)
    # Deprecated - keeping for backwards compatibility
    create_rotated_image(folder, filename)
  end

  def self.get_rotated_image(folder, filename)
    ext = File.extname(filename)
    File.join( folder, File.basename(filename, ext) + 'rotated' + ext )
  end
end
