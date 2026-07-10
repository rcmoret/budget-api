# frozen_string_literal: true

module WebApp
  module Budget
    module Categories
      class UpdateController < BaseController
        include Mixins::HasRedirectParams
        before_action :redirect_to_budget_index, if: -> { category.nil? }
        before_action :set_update_intent
        before_action :set_archived_at!

        def call
          if form.save
            set_success_message!
            redirect_to redirect_path
          else
            redirect_to budget_dashboard_path
          end
        end

        private

        def form
          @form ||= Forms::Budget::CategoryForm.new(
            current_user_profile,
            category,
            update_params
          )
        end

        def category
          @category ||= ::Budget::Category.fetch(
            current_user_profile,
            slug: params.fetch(:slug)
          )
        end

        def redirect_to_budget_index = redirect_to budget_dashboard_path

        def set_update_intent
          @update_intent = {
            archiving: params.require(:category)[:is_archived],
            archived?: category.archived?,
            original_attributes: category.attributes.slice(*update_params.keys),
          }
        end

        def update_params
          params
            .require(:category)
            .permit(
              :name,
              :slug,
              :accrual,
              :default_amount,
              :icon_key,
              :is_per_diem_enabled,
              maturity_intervals: %i[month year _destroy]
            )
        end

        def set_success_message!
          case @update_intent
          in { archiving: true, archived?: false, ** }
            flash[:warning] = "#{category.name} archived."
          in { archived?: true, archiving: false }
            flash[:notice] = "#{category.name} archived."
          else
            message_segments = [ "#{category.name} updated" ]
            if changed_attributes.any?
              message_segments << "(#{changed_attributes.join(', ')})"
            end
            flash[:notice] = "#{message_segments.join(' ')}."
            flash[:category_key] = { category.key => "updated" }
          end
        end

        def changed_attributes
          (@update_intent || {})
            .fetch(:original_attributes)
            .reduce([]) do |memo, (key, value)|
              next memo if category.attributes[key] == value

              memo << key.humanize(capitalize: false)
            end
        end

        def set_archived_at!
          if params.require(:category)[:is_archived]
            category.assign_attributes(archived_at: Time.current)
          else
            category.assign_attributes(archived_at: nil)
          end
        end
      end
    end
  end
end
