module Serializers; end

# Rails < 7.1 pushes every autoload path with namespace: Object after
# initializers run, which would clobber the namespace below.
ActiveSupport::Dependencies.autoload_paths.delete(Rails.root.join("app/serializers").to_s)

Rails.autoloaders.main.push_dir(
  Rails.root.join("app/serializers"),
  namespace: Serializers
)
