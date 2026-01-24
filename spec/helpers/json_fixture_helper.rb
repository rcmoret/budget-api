module JSONResponseHelper
  FILE_EXTENSION = ".json.erb".freeze

  def fixture_response(*file_paths, **kw_args)
    render_response(template: read_template(*file_paths), **kw_args) do |resp|
      JSON.parse(resp)
    end
  end

  def fixture_json_response(file_name, **kw_args)
    render_response(template: read_template(file_name), **kw_args)
  end

  private

  Bindable = Class.new do
    def initialize(options)
      @options = options
    end

    attr_reader :options

    def quoted(value)
      case value
      in Integer | Float
        value
      else
        value.to_json
      end
    end
  end

  def render_response(template:, **kw_args)
    bindable = Bindable.new(**kw_args)

    ERB.new(template).result(bindable.instance_eval { binding }).then do |resp|
      if block_given?
        yield(resp)
      else
        resp
      end
    end
  end

  def read_template(*file_paths)
    file_paths.pop.then do |file_name|
      file_name += FILE_EXTENSION unless file_name.ends_with?(FILE_EXTENSION)
      file_path = Rails.root.join("spec", "fixtures", *file_paths, file_name)

      File.read(file_path)
    end
  end
end
