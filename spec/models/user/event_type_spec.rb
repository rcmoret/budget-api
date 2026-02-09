require "rails_helper"

RSpec.describe User::EventType do
  describe ".for" do
    context "when passing a valid name" do
      context "when no event exists with that name" do
        it "creates a record" do
          expect { described_class.for(:user_auth_token_requested) }
            .to change { described_class.count }.by(+1)
        end
      end

      context "when an event exists with that name" do
        before { described_class.create(name:) }

        let(:name) { :user_auth_token_requested }

        it "does not create a new record" do
          expect { described_class.for(name) }.not_to(change do
            described_class.count
          end)
        end
      end
    end
  end

  describe "#subscriber" do
    context "when a subscriber is defined" do
      subject { described_class.create(name: :user_auth_token_requested) }

      it "returns a handler" do
        expect(subject.subscriber)
          .to eq User::EventHandlers::NewAuthTokenRequested
      end
    end

    context "when no subscriber is defined" do
      subject { described_class.create(name: :new_user_oddball_request) }

      it "returns the null event handler" do
        expect(subject.subscriber).to eq described_class::NullEventHandler
      end
    end
  end
end
