require "rails_helper"

describe Forms::Budget::CategoryForm do
  describe "#save" do
    subject { described_class.new(user, category, params) }

    context "when creating a new category" do
      let(:user) { create(:user) }
      let(:category) { build(:category, user_group: user.group) }
      let(:params) do
        category_params(
          key: SecureRandom.hex(6),
          expense: true,
          monthly: true,
          accrual: false,
          default_amount: 0,
          slug: "new-category"
        )
      end

      it "creates the new category" do
        expect { subject.save }
          .to change { Budget::Category.count }
          .by(+1)
      end
    end

    context "when creating a new category with a maturity inverval" do
      let(:user) { create(:user) }
      let(:category) { build(:category, user_group: user.group) }
      let(:params) do
        category_params(
          key: SecureRandom.hex(6),
          expense: true,
          monthly: true,
          accrual: true,
          default_amount: 0,
          slug: "new-category",
          maturity_intervals_attributes: [
            { month: 1, year: (Time.current.year + 1) },
            { month: 5, year: (Time.current.year + 1) },
          ]
        )
      end

      it "creates the new category and maturity interval" do
        expect { subject.save }
          .to change { Budget::Category.count }
          .by(+1)
          .and change { Budget::CategoryMaturityInterval.count }
          .by(+2)
      end
    end

    context "when updating an existing category" do
      context "when updating the base attributes" do
        let(:user) { create(:user) }
        let(:category) { create(:category, :accrual, user_group: user.group) }
        let(:params) { category_params(accrual: false) }

        it "updates the attribute" do
          expect { subject.save }
            .to change { category.reload.accrual }
            .from(true)
            .to(false)
        end
      end

      context "when passing a maturity interva that already exists" do
        let(:user) { create(:user) }
        let(:category) { create(:category, :accrual, user_group: user.group) }
        let(:interval) { create(:budget_interval, user_group: user.group) }
        let(:params) do
          category_params(
            maturity_intervals_attributes: [
              month: interval.month,
              year: interval.year,
            ]
          )
        end

        before do
          create(
            :maturity_interval,
            category: category,
            interval: interval
          )
        end

        it "does not create a new maturity interval" do
          expect { subject.save }
            .not_to(change { Budget::CategoryMaturityInterval.count })
        end
      end

      context "when adding a maturity interval" do
        let(:user) { create(:user) }
        let(:category) { create(:category, :accrual, user_group: user.group) }
        let(:interval) { create(:budget_interval, user_group: user.group) }
        let(:params) do
          category_params(
            maturity_intervals_attributes: [
              month: interval.next.month,
              year: interval.next.year,
            ]
          )
        end

        before do
          create(
            :maturity_interval,
            category: category,
            interval: interval
          )
        end

        it "creates the new maturity interval" do
          expect { subject.save }
            .to change { Budget::CategoryMaturityInterval.count }
            .by(+1)
        end
      end

      context "when deleting a maturity interval" do
        let(:user) { create(:user) }
        let(:category) { create(:category, :accrual, user_group: user.group) }
        let(:interval) { create(:budget_interval, user_group: user.group) }
        let(:params) do
          category_params(
            maturity_intervals_attributes: [
              month: interval.month,
              year: interval.year,
              _destroy: true,
            ]
          )
        end

        before do
          create(
            :maturity_interval,
            category: category,
            interval: interval
          )
        end

        it "deletes the maturity interval" do
          expect { subject.save }
            .to change { Budget::CategoryMaturityInterval.count }
            .by(-1)
        end
      end
    end
  end

  def category_params(**options)
    ActionController::Parameters
      .new(options)
      .permit(
        :slug,
        :accrual,
        :default_amount,
        :is_per_diem_enabled,
        maturity_intervals_attributes: %i[month year _destroy]
      )
  end
end
