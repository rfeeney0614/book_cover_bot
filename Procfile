web: bundle exec rails db:migrate
web: bundle exec rake solid_queue:start -d -L ./log/solid.log
web: bundle exec puma -C config/puma.rb
