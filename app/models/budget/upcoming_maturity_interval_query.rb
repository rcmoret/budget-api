module Budget
  class UpcomingMaturityIntervalQuery
    BUDGET_CATEGORIES = Category.arel_table
    BUDGET_INTERVALS = Interval.arel_table
    BUDGET_CATEGORY_MATURITY_INTERVALS = CategoryMaturityInterval.arel_table

    def initialize(interval:)
      @interval = interval
    end

    def call
      CollectionSerializer.new(
        serializer: UpcomingMaturityIntervalSerializer
      ) do
        ApplicationRecord.connection.exec_query(query.to_sql).to_a
      end
    end

    private

    # rubocop:disable Metrics/AbcSize
    def query
      BUDGET_CATEGORY_MATURITY_INTERVALS
        .join(BUDGET_INTERVALS)
        .on(
          BUDGET_INTERVALS[:id]
          .eq(BUDGET_CATEGORY_MATURITY_INTERVALS[:budget_interval_id])
        )
        .join(BUDGET_CATEGORIES)
        .on(
          BUDGET_CATEGORIES[:id]
          .eq(BUDGET_CATEGORY_MATURITY_INTERVALS[:budget_category_id])
          .and(BUDGET_CATEGORIES[:user_group_id].eq(user_group_id))
        )
        .project(*project)
        .where(where_clause)
        .group(BUDGET_CATEGORIES[:id])
    end
    # rubocop:enable Metrics/AbcSize

    def project
      [
        BUDGET_CATEGORIES[:id].as("budget_category_id"),
        Arel::Nodes::NamedFunction.new(
          "make_date", [
            BUDGET_INTERVALS[:year],
            BUDGET_INTERVALS[:month],
            1,
          ]
        ).minimum.as("upcoming_date"),
      ]
    end

    def where_clause
      BUDGET_INTERVALS[:year].gt(interval.year).or(
        BUDGET_INTERVALS[:year].eq(interval.year)
        .and(BUDGET_INTERVALS[:month].gteq(interval.month))
      )
    end

    attr_reader :interval

    delegate :user_group_id, to: :interval

    NullSerializer = Class.new(ApplicationSerializer) do
      attributes :budget_category_id, :month, :year

      def budget_category_id
        __getobj__
      end

      def month; end
      def year; end
    end

    CollectionSerializer = Class.new(SerializableCollection) do
      def find(budget_category_id)
        super() do |result_object|
          budget_category_id == result_object.budget_category_id
        end ||
          NullSerializer.new(budget_category_id)
      end
    end

    UpcomingMaturityIntervalSerializer = Class.new(ApplicationSerializer) do
      attributes :budget_category_id, :month, :year

      def budget_category_id
        fetch("budget_category_id")
      end

      delegate :month, :year, to: :date

      private

      def date
        @date ||= fetch("upcoming_date").to_date
      end
    end
  end
end
