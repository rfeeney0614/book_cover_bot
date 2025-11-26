release: cd bookbot-api && bundle exec rails db:migrate && bundle exec rails db:seed
worker: cd bookbot-api && bundle exec rake solid_queue:start
web: cd bookbot-api && bundle exec puma -C config/puma.rb -p $PORT -e $RACK_ENV
