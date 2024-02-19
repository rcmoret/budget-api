require "rails_helper"

RSpec.describe User::EventHandlers::ExpireAllActiveTokens do
  describe "#call" do
    let(:user) { create(:user) }
    let(:event) { create(:user_event, actor: user) }
    let(:success_event) { User::EventType.for(:user_expired_all_tokens) }

    before { create_list(:auth_token_context, 5, user: user) }

    it "expires all active tokens for a user" do
      expect { described_class.new(event).call }
        .to(change { Auth::Token::Context.active.belonging_to(user).count }
        .from(5)
        .to(0))
    end

    it "records a success event" do
      expect { described_class.new(event).call }
        .to(change { User::Event.where(actor: user, event_type: success_event).count }.by(+1))
    end
  end
end
