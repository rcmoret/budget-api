max_threads_count = ENV.fetch("RAILS_MAX_THREADS", 5)
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

worker_timeout 3600 if ENV.fetch("RAILS_ENV", "development") == "development"
port ENV.fetch("PORT", 3000)

environment ENV.fetch("RAILS_ENV") { "development" }

pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

localhost_key = File.join("config", "local-certs", "localhost-key.pem").to_s
localhost_crt = File.join("config", "local-certs", "localhost.pem").to_s

ssl_bind "0.0.0.0", 3002, {
  key: localhost_key,
  cert: localhost_crt,
  verify_mode: "none",
}

# Allow puma to be restarted by `bin/rails restart` command.
plugin :tmp_restart
