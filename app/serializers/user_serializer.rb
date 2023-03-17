class UserSerializer < ApplicationSerializer
  attribute :accounts, on_render: :render

  def accounts
    Users::AccountsSerializer.new(user).accounts
  end

  private

  def user
    __getobj__
  end
end
