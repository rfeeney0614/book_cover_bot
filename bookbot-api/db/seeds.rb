# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create initial user if none exists
if User.count.zero?
  username = ENV.fetch('INITIAL_USERNAME', 'admin')
  password = ENV.fetch('INITIAL_PASSWORD', 'changeme123')
  
  User.create!(
    username: username,
    password: password
  )
  
  puts "Created user: #{username}"
  puts "IMPORTANT: Change the password immediately after first login!"
end
