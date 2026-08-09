# Without expire_after, the session cookie has no Max-Age/Expires and is
# purged whenever the browser considers the session "over". Desktop browser
# processes rarely restart, so this went unnoticed there, but mobile OSes
# kill backgrounded browser processes for memory constantly, wiping the
# cookie and forcing a re-login far more often.
Rails.application.config.session_store :cookie_store, key: "_api_session", expire_after: 14.days
