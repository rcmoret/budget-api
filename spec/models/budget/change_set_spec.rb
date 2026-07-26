require "rails_helper"

RSpec.describe Budget::ChangeSet do
  describe "notes" do
    let(:change_set) { create(:budget_change_set, :adjust, notes:) }

    context "when notes contains text" do
      let(:notes) do
        {
          "type" => "doc",
          "content" => [
            {
              "type" => "paragraph",
              "content" => [ { "type" => "text", "text" => "hello" } ],
            },
          ],
        }
      end

      it "persists the notes doc" do
        expect(change_set.reload.notes).to eq(notes)
      end
    end

    context "when notes has no text content" do
      let(:notes) do
        { "type" => "doc", "content" => [ { "type" => "paragraph" } ] }
      end

      it "nullifies notes on save" do
        expect(change_set.reload.notes).to be_nil
      end
    end

    context "when notes is nil" do
      let(:notes) { nil }

      it "leaves notes as nil" do
        expect(change_set.reload.notes).to be_nil
      end
    end
  end
end
