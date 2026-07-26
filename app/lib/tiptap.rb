module Tiptap
  def self.blank?(doc)
    !text?(doc)
  end

  def self.text?(node)
    case node
    when Hash
      return true if node["type"] == "text" && node["text"].present?

      text?(node["content"])
    when Array
      node.any? { |child| text?(child) }
    else
      false
    end
  end
end
