require "rails_helper"

RSpec.describe User::EventForm do
  describe "#call" do
    context "when the event saves successfully" do
      before do
        allow(User::Event).to receive(:new).and_return(instance_double(
          User::Event, save: true
        ))
      end

      let(:actor) { create(:user) }

      context "when a passing the minumum arguments" do
        subject do
          described_class.new(actor:, event_type: event_type_name)
        end

        let(:event_type) { User::EventType.for(event_type_name) }
        let(:event_type_name) { :user_update_requested }

        it "records an event where the target user is " \
           "the same user as the actor, emtpy data" do
          expect(User::Event).to receive(:new).with(hash_including(
            target_user: actor, data: {}
          ))

          subject.call
        end
      end

      context "when an actor and target_user are provided" do
        subject do
          described_class.new(actor:, event_type: event_type_name,
            target_user:)
        end

        let(:target_user) { create(:user) }
        let(:event_type) { User::EventType.for(event_type_name) }
        let(:event_type_name) { :user_update_requested }

        it "records an event with the target user, the actor, emtpy data" do
          expect(User::Event)
            .to receive(:new)
            .with(hash_including(target_user:, actor:, data: {},
              event_type:))

          subject.call
        end
      end

      context "when there is a registered subscriber" do
        before do
          allow(User::EventHandlers::NewAuthTokenRequested)
            .to receive(:new)
            .and_return(event_handler_double)
        end

        let(:event_type_name) { :user_auth_token_requested }
        let(:event_handler_double) do
          instance_double(User::EventHandlers::NewAuthTokenRequested,
            call: [ :ok ])
        end
        let(:actor) { create(:user) }

        context "when no data or transient data is passed" do
          subject do
            described_class.new(actor:, event_type: event_type_name)
          end

          it "calls the registered subscriber" do
            expect(User::EventHandlers::NewAuthTokenRequested)
              .to receive(:new).with(anything, {})
            expect(event_handler_double).to receive(:call)

            subject.call
          end
        end

        context "when data and transient data is passed" do
          subject do
            described_class.new(
              actor:,
              event_type: event_type_name,
              event_data: data,
              transient_data:,
            )
          end

          let(:data) { { key: KeyGenerator.call, time: Time.current } }
          let(:transient_data) { { password: SecureRandom.hex(10) } }

          it "creates an event with the data, transient data but " \
             "where the values are filtered" do
            expected_data = data.merge(password: "[FILTERED]")
            expect(User::Event)
              .to receive(:new)
              .with(hash_including(data: expected_data))

            subject.call
          end

          it "calls the registered subscriber with transient data" do
            expect(User::EventHandlers::NewAuthTokenRequested)
              .to receive(:new)
              .with(anything, transient_data)
            expect(event_handler_double).to receive(:call)

            subject.call
          end
        end
      end

      context "when there is no registered subscriber" do
        before do
          allow(User::EventType::NullEventHandler)
            .to receive(:new)
            .and_return(event_handler_double)
        end

        let(:event_handler_double) do
          instance_double(User::EventType::NullEventHandler, call: [ :ok ])
        end

        context "when no data or transient data is passed" do
          subject do
            described_class.new(actor:, event_type: event_type_name)
          end

          let(:event_type) { User::EventType.for(event_type_name) }
          let(:event_type_name) { :user_update_requested }

          it "calls to the user event type null event handler" do
            expect(User::EventType::NullEventHandler).to receive(:new).with(
              anything, {}
            )
            expect(event_handler_double).to receive(:call)

            subject.call
          end
        end

        context "when data and transient data is passed" do
          subject do
            described_class.new(
              actor:,
              event_type: event_type_name,
              event_data: data,
              transient_data:,
            )
          end

          let(:event_type) { User::EventType.for(event_type_name) }
          let(:event_type_name) { :user_update_requested }
          let(:data) { { key: KeyGenerator.call, time: Time.current } }
          let(:transient_data) { { password: SecureRandom.hex(10) } }

          it "creates an event with data and transient data " \
             "but the values are filtered" do
            expected_data = data.merge(password: "[FILTERED]")
            expect(User::Event)
              .to receive(:new)
              .with(hash_including(data: expected_data))

            subject.call
          end

          it "calls to the user event type null event handler" do
            expect(User::EventType::NullEventHandler)
              .to receive(:new).with(anything, transient_data)
            expect(event_handler_double).to receive(:call)

            subject.call
          end
        end
      end
    end

    context "when the event fails to save" do
      subject do
        described_class.new(actor: user, event_type: :invalid_event_type_name)
      end

      let(:user) { create(:user) }

      before do
        allow(User::Event).to receive(:new).and_return(instance_double(
          User::Event, save: false
        ))
      end

      it "raises an error" do
        expect { subject.call }.to raise_error(StandardError)
      end
    end
  end
end
