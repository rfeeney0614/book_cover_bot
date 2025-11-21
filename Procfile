release: cd bookbot-api && bundle exec rails db:migrate
worker: cd bookbot-api && bundle exec rake solid_queue:start
web: cd bookbot-api && bundle exec puma -C config/puma.rb -p $PORT
