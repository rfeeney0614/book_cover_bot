namespace :bookbot do
  desc "import records from spreadsheet"
  task import: :environment do
    path = Rails.root.join('app', 'assets', 'etsy_books.xlsx').to_s
    xlsx = Roo::Spreadsheet.open(path)
    xlsx.sheet(0).each_with_index(title: 'Title', author: 'Author',
                                  page_count: 'Round', edition: 'Special Editon') do |row, row_index|
        next unless row[:title].present?
        next if row_index == 0
        title = row[:title]
        author = row[:author]
        page_count = row[:page_count] || 0
        edition = row[:edition] || "Standard"
        book = Book.create_with(author: author, page_count: page_count).find_or_create_by(title: title)
        book.save!
        book.covers.create!(edition: edition)
    end
  end
end
