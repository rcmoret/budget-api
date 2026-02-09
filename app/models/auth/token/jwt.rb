require "jwt"

module Auth
  module Token
    class JWT
      include Singleton

      class << self
        extend Forwardable
        def_delegators :instance, :encode, :decode
      end

      ISSUER = ENV.fetch("APP_URL", nil)
      SIGNATURE_ALGORITHM = "RS256".freeze
      SIGNATURE_PRIVATE_KEY = OpenSSL::PKey::RSA.new(2048)
      SIGNATURE_PUBLIC_KEY = SIGNATURE_PRIVATE_KEY.public_key

      def encode(payload: {}, exp: 4.days.from_now)
        ::JWT.encode(
          payload.merge(default_options).merge(exp: exp.to_i),
          SIGNATURE_PRIVATE_KEY,
          SIGNATURE_ALGORITHM,
        )
      end

      def decode(token, options: {})
        payload, _headers = ::JWT.decode(
          token,
          SIGNATURE_PUBLIC_KEY,
          true,
          algorithm: SIGNATURE_ALGORITHM,
          **options.merge(default_options),
        )
        [ :ok, payload.deep_symbolize_keys ]
      rescue ::JWT::DecodeError => e
        [ :error, { token: e.message } ]
      end

      private

      def default_options
        {
          iss: ISSUER,
          verify_iss: true,
        }
      end
    end
  end
end
