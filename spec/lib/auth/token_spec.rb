require "rails_helper"

RSpec.describe Auth::Token do
  describe ".encode" do
    context "when providing a basic payload" do
      it "returns a token string" do
        subject = described_class.encode(payload: { user_id: rand(100) })

        expect(subject).to be_a String
      end

      it "uses 24 hours from now as the default expiration" do
        freeze_time do
          expect(JWT)
            .to receive(:encode)
            .with(hash_including(exp: 24.hours.from_now.to_i), anything, anything)

          described_class.encode(payload: { user_id: rand(100) })
        end
      end

      it "allows for a different time interval to be provided for expiration" do
        freeze_time do
          expect(JWT)
            .to receive(:encode)
            .with(hash_including(exp: 5.minutes.from_now.to_i), anything, anything)

          described_class.encode(payload: { user_id: rand(100) }, exp: 5.minutes.from_now)
        end
      end

      it "uses #{described_class::SIGNATURE_ALGORITHM} as the alg" do
        expect(JWT)
          .to receive(:encode)
          .with(anything, anything, described_class::SIGNATURE_ALGORITHM)

        described_class.encode(payload: { user_id: rand(100) })
      end

      it "uses the app url for issuer" do
        expect(JWT)
          .to receive(:encode)
          .with(hash_including(iss: ENV["APP_URL"]), anything, anything)

        described_class.encode(payload: { user_id: rand(100) })
      end

      it "uses the private key" do
        expect(JWT)
          .to receive(:encode)
          .with(anything, described_class::SIGNATURE_PRIVATE_KEY, anything)

        described_class.encode(payload: { user_id: rand(100) })
      end
    end

    context "when trying to override the defaults" do
      it "still uses the app url for the issuer" do
        expect(JWT)
          .to receive(:encode)
          .with(hash_including(iss: described_class::ISSUER), anything, anything)

        described_class.encode(payload: { user_id: rand(100), iss: "example.com" })
      end

      it "still verifies issuer" do
        expect(JWT)
          .to receive(:encode)
          .with(hash_including(verify_iss: true), anything, anything)

        described_class.encode(payload: { user_id: rand(100), verify_iss: false })
      end
    end
  end

  describe ".decode" do
    context "when decoding a valid token" do
      it "returns the payload" do
        payload = { user_id: rand(100) }
        token = described_class.encode(payload: payload)

        subject = described_class.decode(token)
        expect(subject.first).to eq(:ok)
        expect(subject.last).to include(payload)
      end

      it "returns the expiration as an int" do
        freeze_time do
          payload = { user_id: rand(100) }
          token = described_class.encode(payload: payload, exp: 1.hour.from_now)

          subject = described_class.decode(token)
          expect(subject.first).to eq(:ok)
          expect(subject.last).to include(exp: 1.hour.from_now.to_i)
        end
      end

      it "returns the issuer" do
        payload = { user_id: rand(100) }
        token = described_class.encode(payload: payload, exp: 1.hour.from_now)

        subject = described_class.decode(token)
        expect(subject.first).to eq(:ok)
        expect(subject.last).to include(iss: described_class::ISSUER)
      end
    end

    context "when decoding an expired token" do
      it "raises an error" do
        payload = { user_id: rand(100) }
        token = described_class.encode(payload: payload, exp: 1.second.ago)

        expect { described_class.decode(token) }
          .to raise_error(JWT::ExpiredSignature)
      end
    end

    context "when the issuer does not match" do
      it "raises an error" do
        token = manual_token(payload: { uid: rand(100), iss: "example.com" })
        expect { described_class.decode(token) }
          .to raise_error(JWT::InvalidIssuerError)
      end
    end

    context "when the token was encoded with a different alg" do
      it "raises an error" do
        token = manual_token(payload: { uid: rand(100), alg: "HS384" })
        expect { described_class.decode(token) }
          .to raise_error(JWT::InvalidIssuerError)
      end
    end

    context "when the token was signed with a different private key" do
      it "raises an error" do
        private_key = OpenSSL::PKey::RSA.new(OpenSSL::PKey::RSA.generate(2048).to_s)
        token = manual_token(payload: { uid: rand(100) }, priv_key: private_key)

        expect { described_class.decode(token) }
          .to raise_error(JWT::VerificationError)
      end
    end
  end

  def manual_token(
    payload:,
    priv_key: described_class::SIGNATURE_PRIVATE_KEY,
    alg: described_class::SIGNATURE_ALGORITHM
  )
    JWT.encode(payload.merge(exp: 1.hour.from_now.to_i), priv_key, alg)
  end
end
