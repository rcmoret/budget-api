class UserSerializer < ApplicationSerializer
  attribute :accounts, on_render: :render
  delegate :accounts, to: :serializer

  private

  def serializer
    ::Accounts::IndexSerializer.new(group.accounts)
  end
end
