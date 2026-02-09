require "rails_helper"

RSpec.describe WebApp::Mixins::HasRedirectParams do
  let(:klass) { Class.new }
  let(:dashboard_path) { "/dashboard" }

  before do
    klass.send(:include, Rails.application.routes.url_helpers)
    klass.send(:include, described_class)
    klass.send(:attr_accessor, :redirect_params)
    klass.send(:attr_accessor, :current_user_profile)
  end

  context "when redirect params are empty" do
    subject { klass.new.tap { |controller| controller.redirect_params = [] } }

    it "returns dashboard path" do
      expect(subject.redirect_path).to eq dashboard_path
    end
  end

  context "when redirect params include 'dashboard' only" do
    subject do
      klass.new.tap do |controller|
        controller.redirect_params = [ "dashboard" ]
      end
    end

    it "returns dashboard path" do
      expect(subject.redirect_path).to eq dashboard_path
    end
  end

  context "when the redirect params include 'budget' only" do
    subject do
      klass.new.tap do |controller|
        controller.redirect_params = [ "budget" ]
      end
    end

    it "returns the budget index path with no params" do
      expect(subject.redirect_path).to eq "/budget"
    end
  end

  context "when the redirect params include 'budget' " \
          "and month (no year) params" do
    subject do
      klass.new.tap do |controller|
        controller.redirect_params = [ "budget", month ]
      end
    end

    let(:month) { rand(1..12).to_s }

    it "returns the dashboard path" do
      expect(subject.redirect_path).to eq dashboard_path
    end
  end

  context "when the redirect params include 'budget' and month, year params" do
    subject do
      klass.new.tap do |controller|
        controller.redirect_params = %W[budget #{month} #{year}]
      end
    end

    let(:month) { rand(1..12).to_s }
    let(:year) { Time.current.year.to_s }

    it "returns the budget index path with month and year segments" do
      expect(subject.redirect_path).to eq "/budget/#{month}/#{year}"
    end
  end

  context "when the redirect params include 'budget' " \
          "and month, year and extra params" do
    subject do
      klass.new.tap do |controller|
        controller.redirect_params = %W[budget #{month} #{year} junk]
      end
    end

    let(:month) { rand(1..12).to_s }
    let(:year) { Time.current.year.to_s }

    it "returns the budget index path with month and year segments" do
      expect(subject.redirect_path).to eq dashboard_path
    end
  end

  context "when the redirect params include 'budget' " \
          "and an invalid month, year params" do
    subject do
      klass.new.tap do |controller|
        controller.redirect_params = [ "budget", month, year ]
      end
    end

    let(:month) { rand(13..20).to_s }
    let(:year) { Time.current.year.to_s }

    it "returns the budget index path with no params" do
      expect(subject.redirect_path).to eq dashboard_path
    end
  end

  context "when the redirect params include 'budget' and 'categories'" do
    subject do
      klass.new.tap do |controller|
        controller.redirect_params = %w[budget categories]
      end
    end

    it "returns the budget index path with no params" do
      expect(subject.redirect_path).to eq "/budget/categories"
    end
  end

  context "when the redirect params only includes 'accounts'" do
    subject do
      klass.new.tap { |controller| controller.redirect_params = %w[accounts] }
    end

    it "returns the accounts index path" do
      expect(subject.redirect_path).to eq "/accounts"
    end
  end

  context "when the redirect params includes " \
          "'accounts', slug and 'transactions'" do
    let(:account) { create(:account) }
    let(:user_profile) { account.user_group.users.first }

    context "when no other segments are present" do
      subject do
        klass.new.tap do |controller|
          controller.redirect_params = %W[account #{account.slug} transactions]
          controller.current_user_profile = user_profile
        end
      end

      it "returns the transactions index path with no month or year params" do
        expect(subject.redirect_path)
          .to eq "/account/#{account.slug}/transactions"
      end
    end

    context "when month and year params are present" do
      subject do
        klass.new.tap do |controller|
          controller.redirect_params = %W[account #{account.slug} transactions
                                          #{month} #{year}]
          controller.current_user_profile = user_profile
        end
      end

      let(:month) { rand(1..12).to_s }
      let(:year) { Time.current.year.to_s }

      it "returns the transactions index path with no month or year params" do
        expect(subject.redirect_path)
          .to eq "/account/#{account.slug}/transactions/#{month}/#{year}"
      end
    end

    context "when month and year params are present - also junk" do
      subject do
        klass.new.tap do |controller|
          controller.redirect_params = %W[
            account
            #{account.slug}
            transactions
            #{month}
            #{year}
            junk
          ]
          controller.current_user_profile = user_profile
        end
      end

      let(:month) { rand(1..12).to_s }
      let(:year) { Time.current.year.to_s }

      it "returns the transactions index path with no month or year params" do
        expect(subject.redirect_path)
          .to eq "/account/#{account.slug}/transactions/#{month}/#{year}"
      end
    end

    context "when an invalid month and year params are present" do
      subject do
        klass.new.tap do |controller|
          controller.redirect_params = %W[account #{account.slug} transactions
                                          #{month} #{year}]
          controller.current_user_profile = user_profile
        end
      end

      let(:month) { rand(13..21).to_s }
      let(:year) { Time.current.year.to_s }

      it "returns the transactions index path with no month or year params" do
        expect(subject.redirect_path)
          .to eq "/account/#{account.slug}/transactions"
      end
    end

    context "when month but no year params are present" do
      subject do
        klass.new.tap do |controller|
          controller.redirect_params = %W[account #{account.slug} transactions
                                          #{month}]
          controller.current_user_profile = user_profile
        end
      end

      let(:month) { rand(1..12).to_s }

      it "returns the transactions index path with no month or year params" do
        expect(subject.redirect_path)
          .to eq "/account/#{account.slug}/transactions"
      end
    end
  end
end
