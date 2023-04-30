require "rails_helper"

RSpec.describe Forms::Budget::EventsForm do
  let(:user) { FactoryBot.create(:user) }

  describe "validations" do
    context "when providing a single item array that is valid" do
      it "returns valid" do
        params = { events: [{ event_type: Budget::EventTypes::CREATE_EVENTS.sample }] }
        form = described_class.new(user, params)
        expect(form).to be_valid
      end
    end

    context "when providing a single item array that is invalid" do
      it "returns not valid" do
        params = { events: [{ event_type: unregistered_event }] }
        form = described_class.new(user, params)
        expect(form).not_to be_valid
      end
    end
  end

  describe "initializing the new event form objects" do
    context "when providing a single item array that is valid" do
      let(:params) { { events: [{ event_type: Budget::EventTypes::CREATE_EVENTS.sample }] } }

      before do
        allow(Budget::Events::CreateItemForm)
          .to receive(:new)
          .with(user, params[:events].first.symbolize_keys)
          .and_return(OpenStruct.new(save: true))
      end

      it "initializes a create item event form object" do
        expect(Budget::Events::CreateItemForm)
          .to receive(:new)
          .with(user, params[:events].first.symbolize_keys)
        described_class.new(user, params).save
      end
    end
  end

  describe "#save" do
    context "when not valid" do
      it "returns false" do
        params = { events: [{ event_type: Budget::EventTypes::CREATE_EVENTS.sample }] }
        form = described_class.new(user, params)
        expect(form.save).to be false
      end
    end

    context "when valid and the form objects all save" do
      let(:form_double) { instance_double(Budget::Events::CreateItemForm, save: true) }
      let(:params) do
        { events: [{ event_type: Budget::EventTypes::CREATE_EVENTS.sample }] }
      end

      before do
        allow(Budget::Events::CreateItemForm)
          .to receive(:new)
          .with(user, params[:events].first.symbolize_keys)
          .and_return(form_double)
      end

      it "returns true" do
        form = described_class.new(user, params)
        expect(form.save).to be true
      end

      it "calls save on the form objects" do
        form = described_class.new(user, params)
        expect(form_double).to receive(:save)
        form.save
      end
    end

    context "when valid and one of the form objects has errors" do
      before do
        allow(Budget::Events::CreateItemForm)
          .to receive(:new)
          .with(user, params[:events].first.symbolize_keys)
          .and_call_original
      end

      let(:event_key) { SecureRandom.hex(6) }
      let(:params) do
        { events: [{ key: event_key, event_type: Budget::EventTypes::CREATE_EVENTS.sample }] }
      end

      it "returns false" do
        form = described_class.new(user, params)
        expect(form.save).to be false
      end

      it "calls surfaces the orm object errors" do
        form = described_class.new(user, params)
        form.save
        expect(form.errors["create_item_form.#{event_key}"]).to include(category: "can't be blank")
      end
    end
  end

  def unregistered_event
    "unregistered_event"
  end
end
