# frozen_string_literal: true

# Data bridge for server-rendered (non-Inertia) pages. Builds the JSON payload
# consumed by the `public.tsx` entry point via the `#public-page-data` script
# tag. Flash notices are mapped with the same presenter the Inertia pages use,
# so both paths produce an identical notifications shape.
module PublicPageHelper
  def public_page_data_json
    notifications =
      WebApp::Pages::Presenters::ApplicationPresenter.with(flash:).flash

    { notifications: }.to_json
  end
end
