if Rails.env.test?
  class ActionDispatch::Cookies::CookieJar
    def encrypted; self; end
    def signed; self; end
  end
end
