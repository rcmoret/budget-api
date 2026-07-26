require "rails_helper"

RSpec.describe Tiptap do
  describe ".blank?" do
    subject { described_class.blank?(doc) }

    context "when doc is nil" do
      let(:doc) { nil }

      it { is_expected.to be true }
    end

    context "when doc has only empty paragraphs" do
      let(:doc) do
        { "type" => "doc", "content" => [ { "type" => "paragraph" } ] }
      end

      it { is_expected.to be true }
    end

    context "when doc has a text node with empty text" do
      let(:doc) do
        {
          "type" => "doc",
          "content" => [
            {
              "type" => "paragraph",
              "content" => [ { "type" => "text", "text" => "" } ],
            },
          ],
        }
      end

      it { is_expected.to be true }
    end

    context "when doc has a text node with content" do
      let(:doc) do
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

      it { is_expected.to be false }
    end

    context "when doc has multiple paragraphs and text is nested deeper" do
      let(:doc) do
        {
          "type" => "doc",
          "content" => [
            { "type" => "paragraph" },
            {
              "type" => "paragraph",
              "content" => [
                {
                  "type" => "text",
                  "text" => "bold text",
                  "marks" => [ { "type" => "bold" } ],
                },
              ],
            },
          ],
        }
      end

      it { is_expected.to be false }
    end
  end
end
