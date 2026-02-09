require "rails_helper"

RSpec.describe User::EventHandlers::NewAuthTokenRequested do
  context "when the user is valid and providing a valid password" do
    before do
      allow(Auth::Token::JWT).to receive(:encode).and_call_original
      allow(User::EventForm).to receive(:new).and_call_original
    end

    let(:password) { Faker::Internet.password }
    let(:user) { create(:user, password:) }
    let(:data) { { ip_address: Faker::Internet.ip_v4_address } }
    let(:event) { create(:user_event, actor: user, data:) }

    it "returns a new token" do
      freeze_time do
        subject = described_class.new(event, password:)

        expect(Auth::Token::JWT)
          .to receive(:encode)
          .with(
            payload: hash_including(user_key: user.key),
            exp: 24.hours.from_now.to_i
          )

        expect { subject.call }.to change { Auth::Token::Context.count }.by(+1)
      end
    end

    it "creates a token generated event" do
      subject = described_class.new(event, password:)

      expect(User::EventForm)
        .to receive(:new)
        .with(actor: user,
          event_type: :user_token_generated,
          event_data: hash_including(data.merge(event_key: event.key)))

      subject.call
    end

    it "returns the new token" do
      token = SecureRandom.uuid
      allow(Auth::Token::JWT).to receive(:encode).and_return(token)
      subject = described_class.new(event, password:)

      expect(subject.call).to eq([ :ok, { token: } ])
    end

    context "when the user has an active token for the given ip address" do
      let(:existing_context) do
        create(:auth_token_context, user:, ip_address:,
          expires_at: 1.minute.from_now)
      end
      let(:password) { Faker::Internet.password }
      let(:user) { create(:user, password:) }
      let(:ip_address) { Faker::Internet.ip_v4_address }
      let(:data) { { ip_address: } }
      let(:event) { create(:user_event, actor: user, data:) }

      it "expires the existing auth token context" do
        freeze_time do
          subject = described_class.new(event, password:)
          expect { subject.call }.to change {
            existing_context.reload.manually_expired_at
          }.from(nil).to(Time.current)
        end
      end

      it "creates a new token and a new token context" do
        freeze_time do
          subject = described_class.new(event, password:)

          expect(Auth::Token::JWT)
            .to receive(:encode)
            .with(
              payload: hash_including(user_key: user.key),
              exp: 24.hours.from_now.to_i
            )

          expect { subject.call }.to change {
            Auth::Token::Context.count
          }.by(+1)
        end
      end

      it "returns the new token" do
        token = SecureRandom.uuid
        allow(Auth::Token::JWT).to receive(:encode).and_return(token)
        subject = described_class.new(event, password:)

        expect(subject.call).to eq([ :ok, { token: } ])
      end

      it "creates a token generated event" do
        subject = described_class.new(event, password:)

        expect(User::EventForm)
          .to receive(:new)
          .with(actor: user,
            event_type: :user_token_generated,
            event_data: hash_including(data.merge(event_key: event.key)))

        subject.call
      end
    end
  end

  context "when the actor and target user are different" do
    let(:password) { Faker::Internet.password }
    let(:actor) { create(:user, password:) }
    let(:target_user) { create(:user) }
    let(:ip_address) { Faker::Internet.ip_v4_address }
    let(:data) { { ip_address: } }
    let(:event) do
      create(:user_event, actor:, target_user:, data:)
    end

    it "does not create a token, returns an error" do
      subject = described_class.new(event, password:)

      expect(Auth::Token::JWT).not_to receive(:encode)
      expect(Auth::Token::Context).not_to receive(:new)
      expect(subject.call).to eq(
        [
          :error,
          {
            user: [ "actor and target user mismatch" ],
          },
        ]
      )
    end
  end

  context "when the user does authenticate with the given password" do
    let(:password) { Faker::Internet.password }
    let(:incorrect_password) { Faker::Internet.password }
    let(:user) { create(:user, password:) }
    let(:event_type) { User::EventType.for(:incorrect_password_attempt) }
    let(:event) { create(:user_event, actor: user) }

    it "does not create a token, returns an error" do
      subject = described_class.new(event, password: incorrect_password)

      expect(Auth::Token::JWT).not_to receive(:encode)
      expect(Auth::Token::Context).not_to receive(:new)
      expect(subject.call).to eq(
        [
          :error,
          {
            password: [ "incorrect email or password" ],
          },
        ]
      )
    end

    it "records an event" do
      expect { described_class.new(event, password: incorrect_password).call }
        .to(change do
              User::Event.where(actor: user, user_event_type: event_type).count
            end.by(+1))
    end
  end

  context "when the auth token context fails to save" do
    before do
      allow(Auth::Token::Context).to receive(:new).and_return(context_double)
    end

    let(:errors_double) do
      instance_double(ActiveModel::Errors, to_hash: { ip_address: "invalid" })
    end
    let(:context_double) do
      instance_double(Auth::Token::Context, save: false, errors: errors_double)
    end
    let(:password) { Faker::Internet.password }
    let(:actor) { create(:user, password:) }
    let(:event) do
      create(:user_event, actor:,
        data: { ip_address: Faker::Internet.ip_v4_address })
    end
    let(:event_type) { User::EventType.for(:token_error) }

    it "does not create a token, returns an error" do
      subject = described_class.new(event, password:)

      expect(Auth::Token::JWT).not_to receive(:encode)
      expect(subject.call).to eq([ :error, { ip_address: "invalid" } ])
    end

    it "creates a error event" do
      expect { described_class.new(event, password:).call }
        .to(change do
              User::Event.where(actor:, event_type:).count
            end.by(+1))
    end
  end
end
