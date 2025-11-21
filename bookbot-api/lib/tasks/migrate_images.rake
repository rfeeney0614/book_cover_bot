namespace :bookbot do
  require 'ruby-progressbar'
  desc "a new task to be executed"
  task migrate_images: :environment do
    source_service = ActiveStorage::Blob.services.fetch(:microsoft)
    destination_service = ActiveStorage::Blob.services.fetch(:local)
    # :service_a/b above should be top-level keys from `config/storage.yml`

    blobs_to_move = ActiveStorage::Blob.where(service_name: source_service.name)
    progressbar = ProgressBar.create(title: "Migrating Images", total: blobs_to_move.count)
    blobs_to_move.find_each do |blob|
      key = blob.key

      raise "I can't find blob #{blob.id} (#{key})" unless source_service.exist?(key)

      unless destination_service.exist?(key)
        source_service.open(blob.key, checksum: blob.checksum) do |file|
          destination_service.upload(blob.key, file, checksum: blob.checksum)
        end
      end
      blob.update_columns(service_name: destination_service.name)
      progressbar.increment
    end
  end
end
