require "rails_helper"

RSpec.describe Auth::Token::Context do
  subject { described_class.new(user: user) }

  let(:user) { FactoryBot.create(:user) }

  it { is_expected.to validate_presence_of(:expires_at) }
  it { is_expected.to validate_presence_of(:ip_address) }
  it { is_expected.to validate_presence_of(:key) }
  it { is_expected.to belong_to(:user) }
  it { is_expected.to validate_length_of(:ip_address).is_at_most(200) }

  describe "manual expiration validation" do
    subject { FactoryBot.build(:auth_token_context) }

    context "when current" do
      it "validates manual expiration is current or in past" do
        travel_to(Time.current.beginning_of_minute) do
          subject.manually_expired_at = Time.current
          expect(subject).to be_valid
        end
      end
    end

    context "when in the past" do
      it "validates manual expiration is current or in past" do
        freeze_time do
          subject.manually_expired_at = 1.day.ago
          expect(subject).to be_valid
        end
      end
    end

    context "when in the future" do
      it "is invalid" do
        freeze_time do
          subject.manually_expired_at = 1.second.from_now
          expect(subject).to be_invalid
        end
      end
    end

    context "when nil" do
      it "is valid" do
        subject.manually_expired_at = nil
        expect(subject).to be_valid
      end
    end
  end
end
